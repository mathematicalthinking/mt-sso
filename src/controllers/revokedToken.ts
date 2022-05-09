import express from 'express';
import createError from 'http-errors';

import { getUser } from '../middleware/user-auth';
import RevokedToken from '../models/RevokedToken';

export const revokeToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  try {
    // currently this endPoint is only used by the vmt server
    // user will be the vmt user who was flagged with doForceLogout=true
    let user = getUser(req);
    if (user === undefined) {
      return next(new createError[401]('revokeToken: User Undefined'));
    }

    let { encodedToken } = req.body;

    if (typeof encodedToken !== 'string') {
      return next(new createError[400]('revokeToken: Token is not a string'));
    }

    let revokedToken = await RevokedToken.create({
      encodedToken,
      user: user._id,
    });

    res.json({
      revokedToken,
    });
  } catch (err) {
    next(err);
  }
};
