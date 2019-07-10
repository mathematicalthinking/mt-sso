import express from 'express';
import { extractBearerToken, verifyJWT } from '../utilities/jwt';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';

import { getIssuerName, getIssuerHost } from '../config/jwt_issuers';
import { VerifiedApiToken } from '../types';

export const verifyBearerToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void => {
  let token = extractBearerToken(req);
  if (token === undefined) {
    return next(new createError[401]());
  }
  req.mt.auth.bearerToken = token;
  next();
};

// used for routes hit by requests from non logged in users
// i.e. login, signup, forgot password etc
// verifies that requests are coming from known sources
// in this case vmt or encompass servers
export const verifyRequestOrigin = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  let { bearerToken, allowedIssuers } = req.mt.auth;
  let secret = process.env.MT_USER_JWT_SECRET;
  let allowedAudience = process.env.JWT_ISSUER_ID; // sso server

  let options: jwt.VerifyOptions = {
    issuer: allowedIssuers,
    audience: allowedAudience,
  };
  try {
    let verifyResults: VerifiedApiToken = await verifyJWT(
      bearerToken,
      secret,
      options,
    );
    req.mt.auth.issuer.id = verifyResults.iss;

    req.mt.auth.issuer.name = getIssuerName(verifyResults.iss);
    req.mt.auth.issuer.host = getIssuerHost(verifyResults.iss);

    if (verifyResults.ssoId) {
      req.mt.auth.ssoId = verifyResults.ssoId;
    }
    next();
  } catch (err) {
    next(new createError[401]());
  }
};

const getIssuerIdFromReq = (req: express.Request): string | undefined => {
  return req.mt.auth.issuer.id;
};

export const getIssuerNameFromReq = (
  req: express.Request,
): string | undefined => {
  let issuerId = getIssuerIdFromReq(req);
  if (issuerId === undefined) {
    return;
  }
  return getIssuerName(issuerId);
};

export const getIssuerUrlFromReq = (
  req: express.Request,
): string | undefined => {
  let issuerId = getIssuerIdFromReq(req);
  if (issuerId === undefined) {
    return;
  }
  return getIssuerHost(issuerId);
};
