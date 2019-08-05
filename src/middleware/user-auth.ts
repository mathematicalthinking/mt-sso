import express from 'express';
import bcrypt from 'bcrypt';
import createError from 'http-errors';

import User from '../models/User';
import RevokedToken from '../models/RevokedToken';
import {
  UserDocument,
  EncSignUpRequest,
  VmtSignUpRequest,
  RevokedTokenDocument,
} from '../types';
import { verifyJWT } from '../utilities/jwt';

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
    isTrashed: false,
  });

  if (user === null) {
    return {
      errorMessage: 'Incorrect username',
      user: null,
    };
  }

  let isGoogleUser = typeof user.googleId === 'string';

  if (typeof user.password !== 'string') {
    if (isGoogleUser) {
      return {
        user: null,
        errorMessage:
          'Account has not been set up to login via password. Try logging in with google.',
      };
    }
    // user does not have a password and did not sign up with google
    // should never happen?
    return {
      user: null,
      errorMessage:
        'Invalid account. Please contact an administrator for further information.',
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
): Promise<UserDocument | null> => {
  try {
    let { ssoId } = req.mt.auth;

    if (ssoId === undefined) {
      return null;
    }
    return User.findById(ssoId);
    // if token is not verified, error will be thrown
  } catch (err) {
    return null;
  }
};

export const prepareMtUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  let user = await getMtUser(req);

  if (user !== null) {
    req.mt.auth.user = user;
  }

  next();
};

export const getUser = (req: express.Request): UserDocument | undefined => {
  return req.mt.auth.user;
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
      if (user === null) {
        return next(new createError[401]());
      }
      req.mt.auth.user = user;
      return next();
    }
    // refresh token has been revoked or is invalid
    return next(new createError[401]());
  } catch (err) {
    console.log('validate refresh token err: ', err);
    next(err);
  }
};

export const requireUser = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void => {
  let user = getUser(req);
  if (user === undefined) {
    return next(new createError[401]());
  }
  next();
};
