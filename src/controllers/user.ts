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

// @PARAM: users is an array of objects as shown below
// @RETURN: a promise that resolves to the bulkWrite result of updating the usernames
// users: [
//   {
//     user: {
//       _id: string;
//       username: string;
//     };
//     role: string;
//   }
// ],

export const updateUsernames = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  const { users } = req.body;
  try {
    console.log('updating usernames in sso');
    console.log('users:');
    console.log(users);
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
    console.log('bulkOps:');
    console.log(bulkOps);
    console.log('about to User.bulkWrite(bulkOps)');
    await User.bulkWrite(bulkOps);
    console.log('returning from sso');
    res.json({ isSuccess: true });
  } catch (error) {
    console.log('error updating usernames in sso');
    console.log('users:');
    console.log(users);
    console.log('error:');
    console.log(error);
    console.log('returning from sso');
    next(error);
  }
};
