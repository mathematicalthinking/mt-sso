import express from 'express';
import createError from 'http-errors';

import { generateAccessToken } from '../utilities/jwt';
import { getUser } from '../middleware/user-auth';

export const createNewAccessToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  try {
    let user = getUser(req);
    if (user === undefined) {
      return next(createError(401, 'createAccessToken: user undefined'));
    }
    let accessToken = await generateAccessToken(user);
    res.json({
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};
