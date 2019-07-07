import { Request, Response, NextFunction } from 'express';

import { getUserFromLogin } from '../middleware/user-auth';
import { LoginRequest } from '../types';
import { generateRefreshToken, generateAccessToken } from '../utilities/jwt';

export const jwtLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let { username, password }: LoginRequest = req.body;
    let { user, errorMessage } = await getUserFromLogin(username, password);
    if (user === null) {
      // send error
      res.json({
        user,
        message: errorMessage,
      });
      return;
    }

    let [accessToken, refreshToken] = await Promise.all([
      generateAccessToken(user),
      generateRefreshToken(user),
    ]);
    res.json({
      user,
      accessToken,
      refreshToken,
    });
    return;
  } catch (err) {
    next(err);
  }
};
