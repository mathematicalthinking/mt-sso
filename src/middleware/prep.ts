import { Request, Response, NextFunction } from 'express';

export const prep = (req: Request, res: Response, next: NextFunction): void => {
  let mtAuth = {
    mt: {
      auth: {
        signup: {},
        issuer: {},
      },
      oauth: {},
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

export const prepareAllowedIssuers = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // currently all routes except signup/enc and signup/vmt
  // accept requests from both vmt and enc
  let path = req.path;
  let segments = path.split('/');

  if (segments.includes('enc')) {
    req.mt.auth.allowedIssuers = [process.env.ENC_JWT_ISSUER_ID];
  } else if (segments.includes('vmt')) {
    req.mt.auth.allowedIssuers = [process.env.VMT_JWT_ISSUER_ID];
  } else {
    req.mt.auth.allowedIssuers = [
      process.env.ENC_JWT_ISSUER_ID,
      process.env.VMT_JWT_ISSUER_ID,
    ];
  }
  next();
};
