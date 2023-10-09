import express from 'express';
import createError from 'http-errors';
import axios from 'axios';
import { getUser } from '../middleware/user-auth';
import User from '../models/User';
import { ObjectId } from 'mongodb';

export const put = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  try {
    let user = getUser(req);
    if (user === undefined) {
      console.log('no user in user ctrl');
      return next(new createError[401]());
    }
    let { id } = req.params;

    const ssoUser = await User.findById(id);

    if (ssoUser === null) {
      return next(new createError[404]('User does not exist'));
    }

    const allowedFields = ['doRevokeRefreshToken', 'isSuspended'];

    allowedFields.forEach(
      (field: string): void => {
        if (typeof req.body[field] === 'boolean') {
          ssoUser[field] = req.body[field];
        }
      },
    );
    await ssoUser.save();
    res.json({
      isSuccess: true,
      user: ssoUser,
    });
  } catch (err) {
    next(err);
  }
};
// What is the URL for each app?
const VMT_URL = process.env.VMT_URL;
const ENC_URL = process.env.ENC_URL;

const updateUserName = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  try {
    const userId = req.params.id;
    const userName = req.body.newUserName;
    const user = await User.findById(userId);

    if (!user) {
      return next(createError(404, 'User does not exist'));
    }

    user.name = userName;
    await user.save();

    const vmtResponse = await axios.put(VMT_URL, {
      userId,
      username: userName,
    });

    if (vmtResponse.status !== 200 || !vmtResponse.data.isSuccess) {
      throw new Error('Failed to update username in VMT');
    }

    const encResponse = await axios.put(ENC_URL, {
      userId,
      username: userName,
    });

    if (encResponse.status !== 200 || !encResponse.data.isSuccess) {
      throw new Error('Failed to update username in Encompass');
    }

    res.json({
      isSuccess: true,
    });
  } catch (err) {
    console.error(err);
    next(createError(500, 'Failed to update username'));
  }
};

export { updateUserName };
