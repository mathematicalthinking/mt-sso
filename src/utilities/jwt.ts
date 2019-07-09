import * as jwt from 'jsonwebtoken';
import * as express from 'express';

import { MongooseOId, UserDocument, VerifiedMtTokenPayload } from '../types';

const SSOSecret = process.env.MT_USER_JWT_SECRET;

import {
  accessCookie,
  refreshCookie,
  accessToken,
  apiToken,
} from '../constants/auth';

export function signJWT(
  payload: string | object | Buffer,
  secret: jwt.Secret,
  options?: jwt.SignOptions,
): Promise<string> {
  return new Promise(
    (resolve, reject): void => {
      jwt.sign(
        payload,
        secret,
        options || {},
        (err: Error, encoded: string): void => {
          if (err) {
            reject(err);
          } else {
            resolve(encoded);
          }
        },
      );
    },
  );
}

export function generateAccessToken(mtUser: UserDocument): Promise<string> {
  let { _id, encUserId, vmtUserId } = mtUser;

  let payload = {
    ssoId: _id,
    encUserId,
    vmtUserId,
  };
  let options = {
    expiresIn: accessToken.expiresIn,
    issuer: process.env.JWT_ISSUER_ID,
    subject: 'access',
    audience: [process.env.ENC_JWT_ISSUER_ID, process.env.VMT_JWT_ISSUER_ID],
  };

  return signJWT(payload, SSOSecret, options);
}

export async function generateAPIToken(
  ssoId: MongooseOId,
  expiration: string = apiToken.expiresIn,
): Promise<string> {
  let payload = { isValid: true, ssoId };
  let options: jwt.SignOptions = {
    expiresIn: expiration,
    issuer: process.env.JWT_ISSUER_ID,
  };

  return signJWT(payload, SSOSecret, options);
}

export function extractBearerToken(req: express.Request): string | undefined {
  let { authorization } = req.headers;

  if (typeof authorization === 'string') {
    return authorization.split(' ')[1];
  }
}

export function verifyJWT(
  token: string,
  key: string | Buffer,
  options?: jwt.VerifyOptions,
): Promise<any> {
  return new Promise(
    (resolve, reject): void => {
      jwt.verify(
        token,
        key,
        options || {},
        (err: jwt.JsonWebTokenError, decoded: string | object): void => {
          if (err) {
            reject(err);
          } else {
            resolve(decoded);
          }
        },
      );
    },
  );
}

export async function verifySSOToken(
  token: string,
): Promise<VerifiedMtTokenPayload | null> {
  try {
    return verifyJWT(token, SSOSecret);
  } catch (err) {
    // invalid token
    return null;
  }
}

export const setSsoCookie = (res: express.Response, token: string): void => {
  let doSetSecure =
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';
  res.cookie(accessCookie.name, token, {
    httpOnly: true,
    maxAge: accessCookie.maxAge,
    secure: doSetSecure,
  });
};

export const generateRefreshToken = (mtUser: UserDocument): Promise<string> => {
  let { _id, encUserId, vmtUserId } = mtUser;

  let payload = {
    ssoId: _id,
    encUserId,
    vmtUserId,
  };
  let options = {
    issuer: process.env.JWT_ISSUER_ID,
    subject: 'refresh',
    audience: [process.env.ENC_JWT_ISSUER_ID, process.env.VMT_JWT_ISSUER_ID],
    // expiresIn: refreshToken.expiresIn,
  };

  return signJWT(payload, SSOSecret, options);
};

export const setSsoRefreshCookie = (
  res: express.Response,
  token: string,
): void => {
  let doSetSecure =
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';
  res.cookie(refreshCookie.name, token, {
    httpOnly: true,
    secure: doSetSecure,
  });
};

export const clearAccessCookie = (res: express.Response): void => {
  res.cookie(accessCookie.name, '', { httpOnly: true, maxAge: 0 });
};

export const clearRefreshCookie = (res: express.Response): void => {
  res.cookie(refreshCookie.name, '', { httpOnly: true, maxAge: 0 });
};
