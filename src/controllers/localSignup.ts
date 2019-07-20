import * as express from 'express';
import axios, { AxiosResponse } from 'axios';
import User from '../models/User';

import { getUser } from '../middleware/user-auth';
import {
  generateAPIToken,
  setSsoCookie,
  setSsoRefreshCookie,
  generateAccessToken,
  generateRefreshToken,
} from '../utilities/jwt';
import {
  EncUserDocument,
  VmtUserDocument,
  VmtAccountType,
  EncAccountType,
  EncSignUpRequest,
  VmtSignUpRequest,
} from '../types';

import { sendEmailSMTP } from '../utilities/emails';
import { CONFIRM_EMAIL_TOKEN_EXPIRY } from '../config/emails';
import { getResetToken } from '../utilities/tokens';

export const createEncUser = async (
  mtUser: any,
  requestBody: any,
  apiToken: string,
  requestBodyType: 'enc' | 'vmt' | 'google',
): Promise<EncUserDocument> => {
  let {
    firstName,
    lastName,
    username,
    email,
    _id,
    createdAt,
    updatedAt,
    isEmailConfirmed,
  } = mtUser;

  let {
    organization,
    organizationRequest,
    location,
    isAuthorized,
    requestReason,
    createdBy,
    authorizedBy,
  } = requestBody;

  let accountType =
    requestBodyType === 'enc' ? requestBody.accountType : EncAccountType.T;

  let encUserBody = {
    firstName,
    lastName,
    username,
    email,
    ssoId: _id,
    organization,
    organizationRequest,
    location,
    isAuthorized,
    requestReason,
    accountType,
    createdBy,
    authorizedBy,
    isEmailConfirmed,
    actingRole: accountType === 'S' ? 'student' : 'teacher',
    createDate: createdAt,
    lastModifiedDate: updatedAt,
  };

  // Should we use create date of SSO account? or Date.now()? ...

  let encApiUrl = `${process.env.ENC_URL}/auth/newMtUser`;

  let config = {
    headers: { Authorization: 'Bearer ' + apiToken },
  };

  return axios.post(encApiUrl, encUserBody, config).then(
    (results: AxiosResponse<any>): EncUserDocument => {
      return results.data;
    },
  );
};

export const createVmtUser = (
  mtUser: any,
  requestBody: any,
  apiToken: string,
  requestBodyType: 'enc' | 'vmt' | 'google',
): Promise<VmtUserDocument> => {
  let { firstName, lastName, username, email, _id, isEmailConfirmed } = mtUser;
  let accountType =
    requestBodyType === 'vmt'
      ? requestBody.accountType
      : VmtAccountType.facilitator;

  let vmtUserBody = {
    firstName,
    lastName,
    username,
    email,
    ssoId: _id,
    accountType,
    isEmailConfirmed,
    rooms: requestBody.rooms,
    _id: requestBody._id,
  };

  let vmtApiUrl = `${process.env.VMT_URL}/auth/newMtUser`;
  let config = {
    headers: { Authorization: 'Bearer ' + apiToken },
  };

  return axios.post(vmtApiUrl, vmtUserBody, config).then(
    (results: AxiosResponse<any>): VmtUserDocument => {
      return results.data;
    },
  );
};

export const createBaseUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  try {
    let {
      firstName,
      lastName,
      username,
      password,
      email,
    }: EncSignUpRequest | VmtSignUpRequest = req.body;

    let user = await User.create({
      firstName,
      lastName,
      username,
      password,
      email,
    });

    req.mt.auth.signup.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export const encSignup = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  let currentUser = getUser(req);

  // Do not want to login a user who is being created by a currently logged in user
  // Currently only comes from encompass

  let doLoginNewUser = currentUser === undefined;

  let mtUser = req.mt.auth.signup.user;
  if (mtUser === undefined) {
    // should never happen
    return next();
  }
  let apiToken = await generateAPIToken(mtUser._id);

  let [encUser, vmtUser] = await Promise.all([
    createEncUser(mtUser, req.body, apiToken, 'enc'),
    createVmtUser(mtUser, req.body, apiToken, 'enc'),
  ]);

  mtUser.encUserId = encUser._id;
  mtUser.vmtUserId = vmtUser._id;

  await mtUser.save();

  let accessToken;
  let refreshToken;

  if (doLoginNewUser) {
    [accessToken, refreshToken] = await Promise.all([
      generateAccessToken(mtUser),
      generateRefreshToken(mtUser),
    ]);

    setSsoCookie(res, accessToken);
    setSsoRefreshCookie(res, refreshToken);
  }

  let userEmail = mtUser.email;
  if (typeof userEmail === 'string') {
    let token = await getResetToken(20);

    mtUser.confirmEmailToken = token;
    mtUser.confirmEmailExpires = Date.now() + CONFIRM_EMAIL_TOKEN_EXPIRY; // 1 day

    await mtUser.save();

    sendEmailSMTP(
      userEmail,
      process.env.ENC_URL,
      'confirmEmailAddress',
      token,
      mtUser,
      'EnCoMPASS',
    );
  }

  let results = {
    accessToken,
    refreshToken,
    encUser,
  };
  res.json(results);
};

export const vmtSignup = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  let currentUser = getUser(req);

  // Do not want to login a user who is being created by a currently logged in user
  // Currently only comes from encompass

  let doLoginNewUser = currentUser === undefined;

  let mtUser = req.mt.auth.signup.user;

  if (mtUser === undefined) {
    // should never happen
    return next();
  }
  let apiToken = await generateAPIToken(mtUser._id);

  let [encUser, vmtUser] = await Promise.all([
    createEncUser(mtUser, req.body, apiToken, 'vmt'),
    createVmtUser(mtUser, req.body, apiToken, 'vmt'),
  ]);

  mtUser.encUserId = encUser._id;
  mtUser.vmtUserId = vmtUser._id;

  await mtUser.save();

  let accessToken;
  let refreshToken;

  if (doLoginNewUser) {
    [accessToken, refreshToken] = await Promise.all([
      generateAccessToken(mtUser),
      generateRefreshToken(mtUser),
    ]);

    setSsoCookie(res, accessToken);
    setSsoRefreshCookie(res, refreshToken);
  }

  let userEmail = mtUser.email;
  if (typeof userEmail === 'string') {
    let token = await getResetToken(20);

    mtUser.confirmEmailToken = token;
    mtUser.confirmEmailExpires = Date.now() + CONFIRM_EMAIL_TOKEN_EXPIRY; // 1 day

    await mtUser.save();
    sendEmailSMTP(
      userEmail,
      process.env.VMT_URL,
      'confirmEmailAddress',
      token,
      mtUser,
      'Virtual Math Teams',
    );
  }

  let results = {
    accessToken,
    refreshToken,
    vmtUser,
  };

  res.json(results);
};
