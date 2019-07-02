import { Request, Response, NextFunction } from 'express';

import allowedDomains from '../constants/allowed_domains';

export const prepareRedirectURL = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let { redirectURL } = req.query;
  let authRedirectURL = allowedDomains.includes(redirectURL)
    ? redirectURL
    : process.env.DEFAULT_REDIRECT_URL;

  // set redirectURL on req

  req.mt.auth.redirectURL = authRedirectURL;
  next();
};

export const prep = (req: Request, res: Response, next: NextFunction): void => {
  let mtAuth = {
    mt: {
      auth: {
        signup: {},
      },
    },
  };

  Object.assign(req, mtAuth);

  next();
};

export const pruneRequestBody = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let method = req.method;
  let doPrune = method === 'POST';

  if (!doPrune) {
    return next();
  }

  for (let key of Object.keys(req.body)) {
    // delete empty values before validating
    let val = req.body[key];
    let isEmpty = false;

    if (val === undefined || val === null) {
      isEmpty = true;
    }
    if (typeof val === 'string' && val.trim().length === 0) {
      isEmpty = true;
    }
    if (isEmpty === true) {
      delete req.body[key];
    }
  }
  next();
};
