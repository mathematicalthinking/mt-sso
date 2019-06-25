import { Request, Response, NextFunction } from 'express';

import allowedDomains from '../constants/allowed_domains';

export const prepareRedirectURL = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { redirectURL } = req.query;

  let authRedirectURL = allowedDomains.includes(redirectURL)
    ? redirectURL
    : '/';

  // set redirectURL on req

  req.mt.auth.redirectURL = authRedirectURL;
  next();
};

export const prep = (req: Request, res: Response, next: NextFunction): void => {
  let mtAuth = {
    mt: { auth: {} },
  };

  Object.assign(req, mtAuth);

  next();
};
