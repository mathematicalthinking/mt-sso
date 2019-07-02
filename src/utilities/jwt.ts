import * as jwt from 'jsonwebtoken';
import * as express from 'express';

import { MongooseOId, UserDocument, VerifiedMtTokenPayload } from '../types';

const SSOSecret = process.env.MT_USER_JWT_SECRET;

const SSO_TOKEN_EXPIRY = 86400000; // 1 day;
const API_TOKEN_EXPIRY = 6000; // 30m

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

export function generateSSOToken(mtUser: UserDocument): Promise<string> {
  let { _id, encUserId, vmtUserId } = mtUser;

  let payload = {
    ssoId: _id,
    encUserId,
    vmtUserId,
  };
  let options = {
    expiresIn: SSO_TOKEN_EXPIRY,
  };

  return signJWT(payload, SSOSecret, options);
}

export async function generateAPIToken(
  ssoId: MongooseOId,
  expiration: number = API_TOKEN_EXPIRY,
): Promise<string> {
  let payload = { isValid: true, ssoId };
  let options: jwt.SignOptions = { expiresIn: expiration };

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
        (err: Error, decoded: string | object): void => {
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

export async function getVerifiedApiJWT(
  req: express.Request,
): Promise<any | null> {
  let authToken = extractBearerToken(req);
  if (authToken === undefined) {
    return null;
  }
  try {
    return verifyJWT(authToken, SSOSecret);
  } catch (err) {
    // invalid token
    return null;
  }
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
  res.cookie('mtToken', token, { httpOnly: true, maxAge: SSO_TOKEN_EXPIRY });
};
