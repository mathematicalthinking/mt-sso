/* eslint-disable @typescript-eslint/camelcase */
import express from 'express';
import axios from 'axios';
import { isNil } from 'lodash';

import User from '../../models/User';
import {
  GoogleOauthProfileResponse,
  GoogleSignupResponse,
  GoogleOauthTokenResponse,
} from '../../types';
import {
  generateAPIToken,
  setSsoCookie,
  generateAccessToken,
  generateRefreshToken,
  setSsoRefreshCookie,
} from '../../utilities/jwt';
import { createEncUser, createVmtUser } from '../../controllers/localSignup';

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
      username: email,
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
  try {
    let { code } = req.query;
    if (code === undefined) {
      return;
    }

    if (code) {
      // exchange code for access token
      let googleEndpoint = `https://www.googleapis.com/oauth2/v4/token`;
      let params = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        grant_type: 'authorization_code',
      };

      let results = await axios.post(googleEndpoint, params);

      let resultsData: GoogleOauthTokenResponse = results.data;

      let { access_token } = resultsData;
      let userProfileEndpoint = 'https://www.googleapis.com/oauth2/v3/userinfo';

      let config = {
        headers: { Authorization: 'Bearer ' + access_token },
      };

      let profileResults = await axios.get(userProfileEndpoint, config);

      let profile: GoogleOauthProfileResponse = profileResults.data;

      let { mtUser } = await handleUserProfile(profile);
      if (mtUser === null) {
        let redirectUrl = req.cookies.failureRedirectUrl;
        let error = 'oauthError=emailUnavailable';

        res.redirect(`${redirectUrl}?${error}`);

        return;
      }
      // What is best way to know if user is signing in with google for the first time?
      // Should never have only one of encUserId / vmtUserId ... but what if one failed for some reason?

      let isNewUser = isNil(mtUser.encUserId);

      if (isNewUser) {
        let apiToken = await generateAPIToken(mtUser._id);

        let [encUser, vmtUser] = await Promise.all([
          createEncUser(mtUser, {}, apiToken, 'google'),
          createVmtUser(mtUser, {}, apiToken, 'google'),
        ]);

        mtUser.encUserId = encUser._id;
        mtUser.vmtUserId = vmtUser._id;

        await mtUser.save();
      }

      let [accessToken, refreshToken] = await Promise.all([
        generateAccessToken(mtUser),
        generateRefreshToken(mtUser),
      ]);

      setSsoCookie(res, accessToken);
      setSsoRefreshCookie(res, refreshToken);

      let redirectURL = req.cookies.successRedirectUrl;

      res.redirect(redirectURL);
    }
  } catch (err) {
    next(err);
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
