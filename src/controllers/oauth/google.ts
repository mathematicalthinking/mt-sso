/* eslint-disable @typescript-eslint/camelcase */
import express from 'express';
import axios from 'axios';
import createError from 'http-errors';

import User from '../../models/User';
import {
  GoogleOauthProfileResponse,
  GoogleSignupResponse,
  GoogleOauthTokenResponse,
  VmtUserDocument,
  EncUserDocument,
  UserDocument,
  VmtAccountType,
} from '../../types';
import {
  setSsoCookie,
  generateAccessToken,
  generateRefreshToken,
  setSsoRefreshCookie,
} from '../../utilities/jwt';
import { createEncUser, createVmtUser } from '../../controllers/localSignup';

import EncUser from '../../models/EncUser';
import VmtUser from '../../models/VmtUser';
import { sendEmailSMTP, sendEmailsToAdmins } from '../../utilities/emails';
import { AppNames } from '../../config/app_urls';

const getUniqueUsername = async (email: String) => {
  let username;
  let user;
  const MAX_TRIES = 10;
  let tries = 0;

  do {
    username = generateUsername(email);
    user = await User.findOne({ username });
    tries++;
  } while (user && tries < MAX_TRIES);

  if (tries >= MAX_TRIES)
    throw new Error('Exceeded maximum attempts to generate a unique username');

  return username;
};

const generateUsername = (email: String) => {
  const emailPrefix = email.split('@')[0];

  const shortPrefix = emailPrefix.substring(0, 5);

  const randomThreeDigitNumber = Math.floor(100 + Math.random() * 900);

  return shortPrefix + randomThreeDigitNumber;
};

export const handleUserProfile = async (
  userProfile: GoogleOauthProfileResponse,
): Promise<GoogleSignupResponse> => {
  let { sub, given_name, family_name, picture, email } = userProfile;

  // check if user exists already with username = to email
  // or if user previously signed up locally with username / password but with same email

  let existingUser = await User.findOne({
    $or: [{ username: email }, { email }],
  });

  if (existingUser === null) {
    let mtUser = await User.create({
      username: await getUniqueUsername(email),
      email,
      googleId: sub,
      firstName: given_name,
      lastName: family_name,
      googleProfilePic: picture,
      isEmailConfirmed: true,
    });

    return {
      mtUser,
      message: null,
    };
  }

  // email already associated with an account
  let { googleId } = existingUser;

  if (typeof googleId !== 'string') {
    // existing user is not from google sign up
    return {
      mtUser: null,
      message: 'Email is already in use',
    };
  }

  return {
    mtUser: existingUser,
    message: null,
  };
};

export const googleCallback = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  let mtUser;
  let createdEncUser: EncUserDocument | null = null;
  let createdVmtUser: VmtUserDocument | null = null;
  let vmtUserData: VmtUserDocument | null = null;
  const falureRedirectUrl =
    (req.cookies && req.cookies.failureRedirectUrl) || '/';

  try {
    // 1. Verify access token
    let { code } = req.query;
    if (!code) {
      return res.redirect(`${falureRedirectUrl}?oauthError=missingCode`);
    }

    // exchange code for access token
    const googleTokenURL = `https://www.googleapis.com/oauth2/v4/token`;
    const tokenParams = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL,
      grant_type: 'authorization_code',
    };

    const tokenResp = await axios.post<GoogleOauthTokenResponse>(
      googleTokenURL,
      tokenParams,
    );

    const { access_token } = tokenResp.data;
    if (!access_token) {
      return res.redirect(`${falureRedirectUrl}?oauthError=missingAccessToken`);
    }

    // 2. Get user profile from Google

    const profileResults = await axios.get<GoogleOauthProfileResponse>(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );

    const profile = profileResults.data;

    // 3. Find or create mtUser; handle errors

    let mtUserResults = await handleUserProfile(profile);
    mtUser = mtUserResults.mtUser;
    if (!mtUser) {
      return res.redirect(`${falureRedirectUrl}?oauthError=emailUnavailable`);
    }
    if (mtUser.isSuspended) {
      return res.redirect(`${falureRedirectUrl}?oauthError=userSuspended`);
    }

    // 4. Create EncUser and VmtUser as necessary
    // Under normal circumstances, an mtUser should have both encUserId and vmtUserId. It will not if we have just created the mtUser
    // (i.e., if the user is signing in with Google for the first time).  However, there could have been an error in creating either
    // the EncUser or the VmtUser. What we will do is create an EncUser if mtuser.encUserId is null, and a VmtUser if mtUser.vmtUserId
    // is null. If either of these fails, we will delete the users that we just created.

    // Note that for VMT, there is a special circumstance where a user could have a VMT account with the email address but with the
    // accountType 'pending'. If this is the case, we will swap the ssoId of the pending account with the ssoId of the new mtuser and
    // change the accountType to 'facilitator'. We will do this instead of creating a new VmtUser.

    if (!mtUser.encUserId) {
      createdEncUser = await createEncUser(mtUser, {}, 'google');
    }
    if (!mtUser.vmtUserId) {
      vmtUserData = await VmtUser.findOne({ email: mtUser.email });
      createdVmtUser = await createVmtUser(mtUser, vmtUserData || {}, 'google');
    } else {
      await handleConvertingPendingVmtUser(mtUser);
    }

    // if either of the above fails, we will delete the users that we just created
    // but we will not delete the existing vmtUser if we are converting a pending account
    if (
      (!mtUser.encUserId && !createdEncUser) ||
      (!mtUser.vmtUserId && !createdVmtUser)
    ) {
      if (createdEncUser) {
        await EncUser.findByIdAndDelete(createdEncUser._id);
      }
      if (createdVmtUser && !vmtUserData) {
        await VmtUser.findByIdAndDelete(createdVmtUser._id);
      }
      return next(
        new createError[500](
          'Failed to create Encompass or VMT user. Please try again.',
        ),
      );
    }
    if (createdEncUser) mtUser.encUserId = createdEncUser._id;
    if (createdVmtUser) mtUser.vmtUserId = createdVmtUser._id;

    await mtUser.save();

    // 5. Generate access and refresh tokens
    let [accessToken, refreshToken] = await Promise.all([
      generateAccessToken(mtUser),
      generateRefreshToken(mtUser),
    ]);

    setSsoCookie(res, accessToken);
    setSsoRefreshCookie(res, refreshToken);

    // 6. Redirect to correct app and send welcome or notification email
    let redirectURL = req.cookies.successRedirectUrl || process.env.VMT_URL;
    let appName;
    let hostUrl;

    if (redirectURL.includes(process.env.ENC_URL)) {
      appName = AppNames.Enc;
      hostUrl = process.env.ENC_URL;
    } else {
      appName = AppNames.Vmt;
      hostUrl = process.env.VMT_URL;
    }

    if (createdEncUser || createdVmtUser) {
      sendEmailSMTP(
        mtUser.email || '',
        hostUrl,
        'googleSignup',
        null,
        mtUser,
        appName,
      );

      if (process.env.NODE_ENV === 'production') {
        sendEmailsToAdmins(hostUrl, appName, 'newUserNotification', mtUser);
      } else {
        sendEmailSMTP(
          process.env.EMAIL_USERNAME,
          hostUrl,
          'newUserNotification',
          null,
          mtUser,
          appName,
        );
      }
    }

    res.redirect(redirectURL);
  } catch (err) {
    if (createdEncUser) {
      await EncUser.findByIdAndDelete(createdEncUser._id);
    }
    if (createdVmtUser && !vmtUserData) {
      await VmtUser.findByIdAndDelete(createdVmtUser._id);
    }
    return next(
      new createError[500](
        `Google callback error: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`,
      ),
    );
  }
};

const handleConvertingPendingVmtUser = async (mtUser: UserDocument) => {
  const vmtPendingUser = await VmtUser.findOne({
    email: mtUser.email,
    accountType: 'pending',
  });
  const vmtUser = await VmtUser.findOne({
    email: mtUser.email,
    ssoId: mtUser._id,
  });

  if (vmtPendingUser) {
    vmtPendingUser.ssoId = mtUser._id;
    vmtPendingUser.accountType = VmtAccountType.facilitator;
    vmtPendingUser.isEmailConfirmed = true;
    mtUser.vmtUserId = vmtPendingUser._id;
    await vmtPendingUser.save();
    await mtUser.save();
  }
  if (vmtUser) {
    // Mark the duplicate user as trashed
    vmtUser.isTrashed = true;
    vmtUser.email = '';
    await vmtUser.save();
  }
};

export const googleOauth = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  try {
    let googleEndpoint = `https://accounts.google.com/o/oauth2/v2/auth`;

    let clientId = process.env.GOOGLE_CLIENT_ID;
    let responseType = 'code';
    let scope = 'profile%20email';
    let redirectURI = process.env.GOOGLE_CALLBACK_URL;
    let includeScopes = true;

    let url = `${googleEndpoint}?client_id=${clientId}&response_type=${responseType}&scope=${scope}&redirect_uri=${redirectURI}&include_granted_scopes=${includeScopes}`;

    let options: express.CookieOptions = {
      httpOnly: true,
      maxAge: 300000, // 5min,
    };

    res.cookie('successRedirectUrl', req.mt.oauth.successRedirectUrl, options);
    res.cookie('failureRedirectUrl', req.mt.oauth.failureRedirectUrl, options);

    res.redirect(url);
  } catch (err) {
    next(err);
  }
};
