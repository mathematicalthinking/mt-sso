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

// I need to make the request from Encompass or VMT first to get the updated users information.
// After the username is updated via mt-sso, it will make the put request back to Encompass and VMT.

// What is the URL for each app?
const VMT_URI = process.env.VMT_URL;
const ENC_URI = process.env.ENC_URL;
const updateUserName = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  try {
    const userId = req.params.id;
    const userName = req.body.username;
    const user = await User.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { username: userName } },
    );

    if (!user) {
      return next(createError(404, 'User does not exist'));
    }
    const bearerToken = req.headers['authorization'];

    // handle bulk updateUsernames

    // const vmtResponse = await axios.put(VMT_URI, {
    //   userId,
    //   username: userName,
    // });
    const encResponse = await axios.put(
      `${ENC_URI}/auth/sso/user/${userId}`,
      {
        userId,
        username: userName,
      },
      {
        headers: {
          Authorization: `${bearerToken}`,
        },
      },
    );

    let errorMessage = '';
    // if (vmtResponse.status !== 200 || !vmtResponse.data.isSuccess) {
    //   errorMessage += 'Failed to update username in VMT. ';
    // }
    if (encResponse.status !== 200) {
      errorMessage += 'Failed to update username in Encompass. ';
    }
    if (errorMessage !== '') {
      throw new Error(errorMessage);
    }
    res.json({
      isSuccess: true,
    });
  } catch (err) {
    console.error(err);
    next(createError(500, err.message));
  }
};

export { updateUserName };
