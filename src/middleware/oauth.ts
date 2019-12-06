import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

import allowedDomains from '../constants/allowed_domains';

export const prepareRedirectUrls = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let { redirectURL } = req.query;
  let isValidRedirect = allowedDomains.includes(redirectURL);

  if (!isValidRedirect) {
    return next(new createError[401]('Invalid redirect url'));
  }

  // set redirectURL on req
  req.mt.oauth.successRedirectUrl = redirectURL;

  let isEnc = redirectURL === process.env.ENC_URL;

  let failureRedirectUrl;

  if (isEnc) {
    failureRedirectUrl = `${redirectURL}${
      process.env.ENC_OAUTH_FAILURE_REDIRECT_PATH
    }`;
  } else {
    failureRedirectUrl = `${redirectURL}${
      process.env.VMT_OAUTH_FAILURE_REDIRECT_PATH
    }`;
  }
  req.mt.oauth.failureRedirectUrl = failureRedirectUrl;

  next();
};
