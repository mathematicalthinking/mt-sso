import express from 'express';
import createError from 'http-errors';

import { getUser } from '../middleware/user-auth';
import User from '../models/User';

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

// @PARAM: users is an array of objects in the form { _id, username }
// @RETURN: a promise that resolves to the bulkWrite result of updating the usernames

export const updateUsernames = async (
  users: [
    {
      _id: string;
      username: string;
    }
  ],
): Promise<object> => {
  const bulkOps = users.map(
    (user: { _id: string; username: string }): {} => {
      return {
        updateOne: {
          filter: { vmtUserId: user._id },
          update: { username: user.username },
        },
      };
    },
  );
  return await User.bulkWrite(bulkOps);
};
