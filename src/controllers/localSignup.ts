import * as express from 'express';
import createError from 'http-errors';

import User from '../models/User';

import { getUser } from '../middleware/user-auth';
import {
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

import { sendEmailSMTP, sendEmailsToAdmins } from '../utilities/emails';
import { CONFIRM_EMAIL_TOKEN_EXPIRY } from '../config/emails';
import { getResetToken } from '../utilities/tokens';
import { AppNames } from '../config/app_urls';
import EncUser from '../models/EncUser';
import VmtUser from '../models/VmtUser';
import { generateEncUserAvatar } from '../utilities/ui-avatars';

export const createEncUser = async (
  mtUser: any,
  requestBody: any,
  requestBodyType: 'enc' | 'vmt' | 'google',
): Promise<EncUserDocument | null> => {
  try {
    let {
      firstName,
      lastName,
      username,
      email,
      _id,
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

    let avatar = generateEncUserAvatar(username, firstName, lastName);

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
      createDate: new Date(),
      lastModifiedDate: new Date(),
      avatar,
    };

    let encUser = await EncUser.create(encUserBody);
    return encUser;
  } catch (err) {
    // something went wrong creating the encompass user
    return null;
  }
};

export const createVmtUser = async (
  mtUser: any,
  requestBody: any,
  requestBodyType: 'enc' | 'vmt' | 'google',
): Promise<VmtUserDocument | null> => {
  try {
    let {
      firstName,
      lastName,
      username,
      email,
      _id,
      isEmailConfirmed,
    } = mtUser;
    let accountType =
      requestBodyType === 'vmt'
        ? requestBody.accountType
        : VmtAccountType.facilitator;

    if (requestBodyType === 'google' && requestBody.username) {
      username = requestBody.username;
    }

    let vmtUserBody = {
      firstName,
      lastName,
      username,
      email,
      ssoId: _id,
      accountType,
      isEmailConfirmed,
      rooms: requestBody.rooms,
      courses: requestBody.courses,
    };

    // temp or imported user, preexisting data
    let wasFromTempUser =
      (Array.isArray(requestBody.rooms) && requestBody.rooms.length > 0) ||
      (Array.isArray(requestBody.courses) && requestBody.courses.length > 0);
    // catch an imported proxy course user and confirm email, as it may not exist
    if (Array.isArray(requestBody.courses) && requestBody.courses.length > 0) {
      vmtUserBody = {
        ...vmtUserBody,
        isEmailConfirmed: true,
      };
    }

    let vmtUser;
    // For any user with prior data, find and update that VMT user with mt login data
    if (wasFromTempUser) {
      vmtUser = await VmtUser.findByIdAndUpdate(requestBody._id, vmtUserBody, {
        new: true,
      });
    } else {
      vmtUser = await VmtUser.create(vmtUserBody);
    }
    return vmtUser;
  } catch (err) {
    console.log('err createVmtUser: ', err);
    return null;
  }
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
  let mtUser;
  let didCreateMtUser = false;
  let encUser;
  let vmtUser;
  try {
    let currentUser = getUser(req);

    // Do not want to login a user who is being created by a currently logged in user
    // Currently only comes from encompass

    let doLoginNewUser = currentUser === undefined;

    mtUser = req.mt.auth.signup.user;
    if (mtUser === undefined) {
      // should never happen
      return next();
    }

    [encUser, vmtUser] = await Promise.all([
      createEncUser(mtUser, req.body, 'enc'),
      createVmtUser(mtUser, req.body, 'enc'),
    ]);

    if (encUser === null || vmtUser === null) {
      if (encUser !== null) {
        // vmt errored but enc was successful
        // revert creating of enc user
        await EncUser.findByIdAndDelete(encUser._id);
      } else if (vmtUser !== null) {
        await VmtUser.findByIdAndDelete(vmtUser._id);
      }
      // both creation processes failed
      // just return error
      return next(
        new createError[500](
          'Sorry, an unexpected error occured. Please try again.',
        ),
      );
    }

    mtUser.encUserId = encUser._id;
    mtUser.vmtUserId = vmtUser._id;

    await mtUser.save();
    didCreateMtUser = true;

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
      mtUser.confirmEmailExpires = new Date(
        Date.now() + CONFIRM_EMAIL_TOKEN_EXPIRY,
      ); // 1 day

      await mtUser.save();

      sendEmailSMTP(
        userEmail,
        process.env.ENC_URL,
        'confirmEmailAddress',
        token,
        mtUser,
        AppNames.Enc,
      );

      if (process.env.NODE_ENV === 'production') {
        sendEmailsToAdmins(
          process.env.ENC_URL,
          AppNames.Enc,
          'newUserNotification',
          mtUser,
        );
      } else {
        sendEmailSMTP(
          process.env.ENC_GMAIL_USERNAME,
          process.env.ENC_URL,
          'newUserNotification',
          null,
          mtUser,
          AppNames.Enc,
        );
      }
    }

    let results = {
      accessToken,
      refreshToken,
      encUser,
    };
    res.json(results);
  } catch (err) {
    console.log('Error enc signup: ', err);
    if (didCreateMtUser === false) {
      // error creating sso user
      // revert enc / vmt creation if necessary
      if (encUser) {
        EncUser.findByIdAndDelete(encUser._id);
      }
      if (vmtUser) {
        VmtUser.findByIdAndDelete(vmtUser._id);
      }
      return next(
        new createError[500](
          'Sorry, an unexpected error occured. Please try again.',
        ),
      );
    }
  }
};

export const vmtSignup = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  let mtUser;
  let didCreateMtUser = false;
  let encUser;
  let vmtUser;

  try {
    let currentUser = getUser(req);

    // Do not want to login a user who is being created by a currently logged in user
    // Currently only comes from encompass

    let doLoginNewUser = currentUser === undefined;

    mtUser = req.mt.auth.signup.user;

    if (mtUser === undefined) {
      // should never happen
      return next();
    }

    [encUser, vmtUser] = await Promise.all([
      createEncUser(mtUser, req.body, 'vmt'),
      createVmtUser(mtUser, req.body, 'vmt'),
    ]);

    if (encUser === null || vmtUser === null) {
      if (encUser !== null) {
        // vmt errored but enc was successful
        // revert creating of enc user
        await EncUser.findByIdAndDelete(encUser._id);
      } else if (vmtUser !== null) {
        await VmtUser.findByIdAndDelete(vmtUser._id);
      }
      // both creation processes failed
      // just return error
      return next(
        new createError[500]('VMT user not found. Please try again.'),
      );
    }

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
      mtUser.confirmEmailExpires = new Date(
        Date.now() + CONFIRM_EMAIL_TOKEN_EXPIRY,
      ); // 1 day

      await mtUser.save();
      sendEmailSMTP(
        userEmail,
        process.env.VMT_URL,
        'confirmEmailAddress',
        token,
        mtUser,
        AppNames.Vmt,
      );
      // in production send new user email to all admins
      // otherwise send to test gmail account

      if (process.env.NODE_ENV === 'production') {
        sendEmailsToAdmins(
          process.env.VMT_URL,
          AppNames.Vmt,
          'newUserNotification',
          mtUser,
        );
      } else {
        sendEmailSMTP(
          process.env.VMT_GMAIL_USERNAME,
          process.env.VMT_URL,
          'newUserNotification',
          null,
          mtUser,
          AppNames.Vmt,
        );
      }
    }

    let results = {
      accessToken,
      refreshToken,
      vmtUser,
    };

    res.json(results);
  } catch (err) {
    console.log({ vmtSignupError: err });
    if (didCreateMtUser === false) {
      // error creating sso user
      // revert enc / vmt creation if necessary
      if (encUser) {
        EncUser.findByIdAndDelete(encUser._id);
      }
      if (vmtUser) {
        VmtUser.findByIdAndDelete(vmtUser._id);
      }
      return next(new createError[500](err.message));
    }
  }
};
