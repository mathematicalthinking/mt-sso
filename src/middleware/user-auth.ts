import * as express from 'express';

import * as Joi from '@hapi/joi';

import User from '../models/User';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { VerifiedMtTokenPayload, UserDocument } from '../types';

import { verifyJWT, extractBearerToken } from '../utilities/jwt';

const secret = process.env.MT_USER_JWT_SECRET || '';

interface LoginResult {
  user: null | UserDocument;
  errorMessage: null | string;
}

const LoginRequestSchema = Joi.object().keys({
  username: Joi.string()
    .min(1)
    .max(100)
    .required(),
  password: Joi.string()
    .min(4)
    .max(72)
    .required(),
});

interface LoginRequest {
  username: string;
  password: string;
}

export const getUserFromLogin = async (
  username: unknown,
  password: unknown
): Promise<LoginResult> => {
  let usernameLower =
    typeof username === 'string' ? username.toLowerCase() : '';

  let user: UserDocument | null = await User.findOne({
    username: usernameLower,
  }).lean();

  let results: LoginResult = {
    user,
    errorMessage: null,
  };

  if (user === null) {
    results.errorMessage = 'Incorrect username';
    return results;
  }

  let isPasswordValid: boolean = await bcrypt.compare(password, user.password);

  if (isPasswordValid) {
    return results;
  }

  // invalid password

  results.errorMessage = 'Incorrect password';
  return results;
};

export const generateToken = async (user: UserDocument): Promise<string> => {
  let { _id, encUserId, vmtUserId } = user;

  let payload = {
    mtUserId: _id,
    encUserId,
    vmtUserId,
  };
  let options = {
    expiresIn: '1d',
  };

  return jwt.sign(payload, secret, options);
};

export const getMtUser = async (
  req: express.Request
): Promise<VerifiedMtTokenPayload | null> => {
  try {
    let mtToken = extractBearerToken(req);
    if (!mtToken) {
      return null;
    }

    // if token is not verified, error will be thrown
    return verifyJWT(mtToken, secret);
  } catch (err) {
    return null;
  }
};

export const prepareMtUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  let verifiedPayload: VerifiedMtTokenPayload | null = await getMtUser(req);

  if (verifiedPayload === null) {
    return next();
  }

  let { mtUserId } = verifiedPayload;

  let mtUser: UserDocument | null = await User.findById(mtUserId).lean();
  if (mtUser !== null) {
    req.mt.auth.user = mtUser;
  }
  next();
};

export const getUser = (req: express.Request): UserDocument | undefined => {
  return req.mt.auth.user;
};

export const getAuthRedirectURL = (
  req: express.Request
): string | undefined => {
  return req.mt.auth.redirectURL;
};
