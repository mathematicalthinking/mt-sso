import express from 'express';
import createError from 'http-errors';

import User from '../models/User';
import { getUser } from '../middleware/user-auth';
import { getResetToken } from '../utilities/tokens';
import { sendEmailSMTP } from '../utilities/emails';
import { getIssuerNameFromReq, getIssuerUrlFromReq } from '../middleware/auth';
import { CONFIRM_EMAIL_TOKEN_EXPIRY } from '../config/emails';
import { generateAPIToken } from '../utilities/jwt';
import axios from 'axios';

export const confirmEmail = async function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> {
  try {
    const user = await User.findOne({
      confirmEmailToken: req.params.token,
      confirmEmailExpires: { $gt: Date.now() },
    });
    console.log('confirmEmail Token: ', user);
    if (user === null) {
      res.json({
        isValid: false,
        info: 'Confirm email token is invalid or has expired.',
      });
      return;
    }

    user.isEmailConfirmed = true;
    user.confirmEmailToken = undefined;
    user.confirmEmailExpires = undefined;

    const savedUser = await user.save();

    // updated enc and vmt users

    let apiToken = await generateAPIToken(savedUser._id);

    let config = {
      headers: { Authorization: 'Bearer ' + apiToken },
    };
    let vmtUpdate = { isEmailConfirmed: true, updatedAt: Date.now() };
    let encUpdate = { isEmailConfirmed: true, lastModifiedDate: Date.now() };

    let vmtUrl = `${process.env.VMT_URL}/auth/sso/user/${savedUser.vmtUserId}`;
    let encUrl = `${process.env.ENC_URL}/auth/sso/user/${savedUser.encUserId}`;

    // should we wait for these to be successfully completed?
    axios.put(vmtUrl, vmtUpdate, config);
    axios.put(encUrl, encUpdate, config);

    const data = {
      isValid: true,
      isEmailConfirmed: savedUser.isEmailConfirmed,
    };

    res.json(data);
  } catch (err) {
    console.log('error confirm email: ', err);
    next(err);
  }
};

export const resendConfirmationEmail = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  try {
    const user = getUser(req);
    if (user === undefined) {
      return next(new createError[401]());
    }

    let email = user.email;

    if (email === undefined) {
      // cannot send confirmation email without user email
      res.json({
        isSuccess: false,
        info: 'User is missing email address',
      });
      return;
    }

    let appName = getIssuerNameFromReq(req);

    if (appName === undefined) {
      return next(new createError[403]());
    }

    let host = getIssuerUrlFromReq(req);

    if (host === undefined) {
      // should never happen
      return next(new createError[500]());
    }

    let userRec = await User.findById(user._id);

    if (userRec === null) {
      // should never happen
      return next(new createError[500]());
    }
    const token = await getResetToken(20);

    userRec.confirmEmailToken = token;
    userRec.confirmEmailExpires = Date.now() + CONFIRM_EMAIL_TOKEN_EXPIRY; // 1 day

    let savedUser = await userRec.save();

    await sendEmailSMTP(
      email,
      host,
      'confirmEmailAddress',
      token,
      savedUser,
      appName,
    );
    res.json({
      isSuccess: true,
      info: `Email has been sent to ${email} with instructions for email confirmation.`,
    });
    return;
  } catch (err) {
    console.log('err resend confirm email', err);
    next(new createError[500]());
  }
};
