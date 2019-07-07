import express from 'express';
import { generateAccessToken } from '../utilities/jwt';
import { getUser } from '../middleware/user-auth';
import createError from 'http-errors';

export const createNewAccessToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  let user = getUser(req);
  if (user === undefined) {
    return next(new createError[401]());
  }
  let accessToken = await generateAccessToken(user);
  res.json({
    accessToken,
    refreshToken: req.body.refreshToken,
  });
};
