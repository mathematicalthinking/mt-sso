import express from 'express';
import createError from 'http-errors';
import User from '../models/User';
import { getUser } from '../middleware/user-auth';
import { getResetToken } from '../utilities/tokens';
import { sendEmailSMTP } from '../utilities/emails';
import { getIssuerNameFromReq, getIssuerUrlFromReq } from '../middleware/auth';
import { CONFIRM_EMAIL_TOKEN_EXPIRY } from '../config/emails';
import { isDate, isNil } from 'lodash';
import { AppNames } from '../config/app_urls';
import {
  confirmEncVmtEmails,
  unconfirmEncVmtEmails,
} from '../utilities/enc_vmt_updates/confirmEmail';

export const confirmEmail = async function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> {
  let ssoUser;
  let didConfirmSsoUser = false;
  let wasEncVmtUpdateSuccess = false;

  try {
    ssoUser = await User.findOne({
      confirmEmailToken: req.params.token,
    });

    if (ssoUser === null) {
      res.json({
        isValid: false,
        info: 'Confirm email token is invalid',
      });
      return;
    }

    if (ssoUser.isEmailConfirmed) {
      res.json({
        isValid: false,
        info: 'Email has already been confirmed',
      });
      return;
    }

    // user has matching token and email has not been confirmed yet

    let expiryDate = ssoUser.confirmEmailExpires;

    let isExpired = isDate(expiryDate) && new Date() > expiryDate;

    if (isExpired) {
      res.json({
        isValid: false,
        info: 'Confirm email token is expired',
      });
      return;
    }

    ssoUser.isEmailConfirmed = true;
    ssoUser.confirmEmailDate = new Date();

    // keep token details on ssoUser in case they try to click link again
    // should display message saying that their email has already been confirmed
    // update enc and vmt users

    let { vmtUserId, encUserId } = ssoUser;

    if (isNil(vmtUserId) || isNil(encUserId)) {
      // should never happen
      return next(new createError[500]());
    }

    let {
      wasSuccess,
      updatedEncUser,
      updatedVmtUser,
    } = await confirmEncVmtEmails(encUserId, vmtUserId);
    console.log(' WAS SUCCESS? ', wasSuccess);
    console.log('updted enc: ', updatedEncUser);
    console.log('updted vmt', updatedVmtUser);

    if (wasSuccess === false) {
      // either enc or vmt update failed
      // revert any changes and return error without confirming
      // email on ssoUser
      await unconfirmEncVmtEmails(encUserId, vmtUserId);
      return next(
        new createError[500](
          'Sorry, an unexpected error occurred. Please try again.',
        ),
      );
    }
    wasEncVmtUpdateSuccess = true;
    // save ssoUser once vmt and enc have been updated
    await ssoUser.save();
    didConfirmSsoUser = true;

    let isVmt = getIssuerNameFromReq(req) === AppNames.Vmt;

    const data = {
      isValid: true,
      isEmailConfirmed: ssoUser.isEmailConfirmed,
      user: isVmt ? updatedVmtUser : updatedEncUser,
      confirmedEmail: ssoUser.email,
    };

    res.json(data);
  } catch (err) {
    console.log('error confirm email: ', err);

    if (isNil(ssoUser)) {
      return next(new createError[500]());
    }

    let doRevert = wasEncVmtUpdateSuccess && !didConfirmSsoUser;

    if (doRevert) {
      let { vmtUserId, encUserId } = ssoUser;

      if (isNil(vmtUserId) || isNil(encUserId)) {
        // should never happen
        return next(new createError[500]());
      }
      await unconfirmEncVmtEmails(encUserId, vmtUserId);

      return next(
        new createError[500](
          'Sorry, an unexpected error occurred. Please try again.',
        ),
      );
    }
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
      // must be logged in to resend confirm email email
      return next(new createError[401]());
    }

    let email = user.email;
    if (typeof email !== 'string') {
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
    userRec.confirmEmailExpires = new Date(
      Date.now() + CONFIRM_EMAIL_TOKEN_EXPIRY,
    ); // 1 day

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
