import express from 'express';
import bcrypt from 'bcrypt';
import createError from 'http-errors';

import User from '../models/User';
import RevokedToken from '../models/RevokedToken';
import {
  VerifiedMtTokenPayload,
  UserDocument,
  EncSignUpRequest,
  VmtSignUpRequest,
  RevokedTokenDocument,
} from '../types';
import { verifyJWT, extractBearerToken } from '../utilities/jwt';

const secret = process.env.MT_USER_JWT_SECRET;

interface LoginResult {
  user: null | UserDocument;
  errorMessage: null | string;
}

export const getUserFromLogin = async (
  username: string,
  password: string,
): Promise<LoginResult> => {
  let user: UserDocument | null = await User.findOne({
    username,
  });

  if (user === null) {
    return {
      errorMessage: 'Incorrect username',
      user: null,
    };
  }

  let isPasswordValid: boolean = await bcrypt.compare(password, user.password);
  if (isPasswordValid) {
    return {
      user,
      errorMessage: null,
    };
  }

  // invalid password

  return {
    errorMessage: 'Incorrect password',
    user: null,
  };
};

export const getMtUser = async (
  req: express.Request,
): Promise<VerifiedMtTokenPayload | null> => {
  try {
    let accessToken = extractBearerToken(req);

    if (accessToken === undefined) {
      return null;
    }

    // if token is not verified, error will be thrown
    return verifyJWT(accessToken, secret);
  } catch (err) {
    return null;
  }
};

export const prepareMtUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  let verifiedPayload: VerifiedMtTokenPayload | null = await getMtUser(req);

  if (verifiedPayload === null) {
    return next();
  }

  let { ssoId } = verifiedPayload;

  let mtUser: UserDocument | null = await User.findById(ssoId).lean();
  if (mtUser !== null) {
    req.mt.auth.user = mtUser;
  }
  next();
};

export const getUser = (req: express.Request): UserDocument | undefined => {
  return req.mt.auth.user;
};

export const getAuthRedirectURL = (
  req: express.Request,
): string | undefined => {
  return req.mt.auth.redirectURL;
};

export const verifySignupCredentialsAvailability = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  try {
    let { username, email }: EncSignUpRequest | VmtSignUpRequest = req.body;

    let filter: any = { username };

    if (email !== undefined) {
      filter = { $or: [{ username }, { email }] };
    }

    let existingUser: UserDocument | null = await User.findOne(filter).lean();

    if (existingUser === null) {
      // username and email are available
      return next();
    }
    // username or email is taken
    let isUsernameTaken = existingUser.username === username;
    let noun = isUsernameTaken ? 'username' : 'email address';
    let message = `There already exists a user with that ${noun}`;
    res.json({ message, existingUser });
    return;
  } catch (err) {
    next(err);
  }
};

export const hashSignupPassword = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  try {
    let { password }: EncSignUpRequest | VmtSignUpRequest = req.body;

    let hashedPass = await bcrypt.hash(password, 12);
    req.body.password = hashedPass;
    next();
  } catch (err) {
    next(err);
  }
};

export const isTokenNonRevoked = async (token: string): Promise<boolean> => {
  let revokedToken: RevokedTokenDocument | null = await RevokedToken.findOne({
    encodedToken: token,
  }).lean();
  return revokedToken === null;
};

export const validateRefreshToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  try {
    let encodedToken = req.body.refreshToken;

    if (encodedToken === undefined) {
      return next(new createError[401]());
    }

    let [isTokenValid, verifiedToken] = await Promise.all([
      isTokenNonRevoked(encodedToken),
      verifyJWT(encodedToken, secret),
    ]);

    if (isTokenValid && verifiedToken) {
      // get sso user from db and put on req for controller
      let user = await User.findById(verifiedToken.ssoId).lean();
      if (user !== null) {
        req.mt.auth.user = user;
        return next();
      }
    }
  } catch (err) {
    console.log('validate refresh token err: ', err);
    next(err);
  }
};
