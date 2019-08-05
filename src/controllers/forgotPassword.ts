import * as express from 'express';
import createError from 'http-errors';

import { getResetToken } from '../utilities/tokens';
import User from '../models/User';
import { sendEmailSMTP } from '../utilities/emails';

import { sendError } from '../utilities/errors';

import { getIssuerNameFromReq, getIssuerUrlFromReq } from '../middleware/auth';
export const forgotPassword = async function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void | express.Response> {
  let token;
  let user;

  try {
    let appName = getIssuerNameFromReq(req);

    if (appName === undefined) {
      return next(new createError[403]());
    }

    let host = getIssuerUrlFromReq(req);

    if (host === undefined) {
      // should never happen
      return next(new createError[500]());
    }

    token = await getResetToken(20);

    let { email, username } = req.body;

    if (email) {
      user = await User.findOne({ email });
      if (!user) {
        const msg = {
          info: `There is no ${appName} account associated with that email address`,
          isSuccess: false,
        };
        return res.json(msg);
      }
    } else if (username) {
      user = await User.findOne({ username });
      if (!user) {
        const msg = {
          info: `There is no ${appName} account associated with that username`,
          isSuccess: false,
        };
        return res.json(msg);
      }
    } else {
      // invalid request
      return sendError.InvalidContentError(
        'You must provide a valid username or email',
        res,
      );
    }

    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);

    await user.save();
    // should we assume all users have emails?
    if (!email) {
      if (user.email) {
        email = user.email;
      } else {
        const msg = {
          info: `You must have an email address associated with your ${appName} account in order to reset your password`,
          isSuccess: false,
        };
        return res.json(msg);
      }
    }

    await sendEmailSMTP(email, host, 'resetTokenEmail', token, user, appName);

    return res.json({
      info: `Password reset email sent to ${email}`,
      isSuccess: true,
    });
  } catch (err) {
    console.error(`Error auth/forgot: ${err}`);
    console.trace();
    next(new createError[500]());
  }
};
