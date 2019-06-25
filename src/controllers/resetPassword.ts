import { hash, genSaltSync } from 'bcrypt';
import * as express from 'express';

import User from '../models/User';

import { sendError } from '../utilities/errors';
import { getUser } from '../middleware/user-auth';
import { generateSSOToken } from '../utilities/jwt';
import { getVerifiedApiJWT } from '../utilities/jwt';

export async function validateResetToken(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> {
  try {
    let verifiedJWTPayload = await getVerifiedApiJWT(req);

    if (verifiedJWTPayload === null) {
      return sendError.NotAuthorizedError(null, res);
    }

    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.json({
        info: 'Password reset token is invalid or has expired',
        isValid: false,
      });
      return;
    }
    res.json({ info: 'valid token', isValid: true });
  } catch (err) {
    return sendError.InternalError(err, res);
  }
}
export async function resetPassword(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> {
  try {
    let verifiedJWTPayload = await getVerifiedApiJWT(req);

    if (verifiedJWTPayload === null) {
      return sendError.NotAuthorizedError(null, res);
    }

    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
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

    let mtToken = await generateSSOToken(user);

    res.json({
      user,
      mtToken,
    });
  } catch (err) {
    console.error(`Error resetPassword: ${err}`);
    console.trace();
    return sendError.InternalError(err, res);
  }
}
export async function resetPasswordById(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> {
  try {
    let verifiedJWTPayload = await getVerifiedApiJWT(req);

    if (verifiedJWTPayload === null) {
      return sendError.NotAuthorizedError(null, res);
    }

    const reqUser = getUser(req);

    if (reqUser === undefined) {
      return sendError.NotAuthorizedError(null, res);
    }

    const { id, password } = req.body;

    if (!id || !password) {
      const msg = {
        info: 'Invalid user id or password',
      };
      res.json(msg);
      return;
    }

    const user = await User.findById(id);
    if (!user) {
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
    return sendError.InternalError(err, res);
  }
}
