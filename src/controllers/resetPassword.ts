import { hash, genSaltSync } from 'bcrypt';
import * as express from 'express';

import User from '../models/User';

import { sendError } from '../utilities/errors';
import { getUser } from '../middleware/user-auth';
import { generateAccessToken, generateRefreshToken } from '../utilities/jwt';

export async function validateResetToken(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    }).lean();

    if (user === null) {
      res.json({
        info: 'Password reset token is invalid or has expired',
        isValid: false,
      });
      return;
    }
    res.json({ info: 'valid token', isValid: true });
  } catch (err) {
    next(err);
  }
}
export async function resetPassword(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (user === null) {
      res.json({
        info: 'Password reset token is invalid or has expired.',
      });
      return;
    }

    const hashPass = await hash(req.body.password, genSaltSync(12));
    user.password = hashPass;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    let [accessToken, refreshToken] = await Promise.all([
      generateAccessToken(user),
      generateRefreshToken(user),
    ]);

    res.json({
      user,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(`Error resetPassword: ${err}`);
    console.trace();
    next(err);
  }
}
export async function resetPasswordById(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> {
  try {
    const reqUser = getUser(req);

    if (reqUser === undefined) {
      return sendError.NotAuthorizedError(null, res);
    }

    const { id, password } = req.body;

    const user = await User.findById(id);
    if (user === null) {
      res.json({
        info: 'Cannot find user',
      });
      return;
    }

    const hashPass = await hash(password, genSaltSync(12));

    user.password = hashPass;
    user.lastModifiedBy = reqUser._id;

    // should we store most recent password and block that password in future? or all past passwords and block all of them?

    await user.save();

    res.json(user);
  } catch (err) {
    next(err);
  }
}
