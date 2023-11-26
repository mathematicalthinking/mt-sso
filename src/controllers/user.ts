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

/**
 * The constant that updateUsernames uses to figure out which
 * apps need to be alerted about username changes.
 */
const APPS = [
  {
    baseURI: process.env.VMT_URL,
    path: '/auth/sso/usernames',
  },
  {
    baseURI: process.env.ENC_URL,
    path: '/auth/sso/usernames',
  },
];

const updateUsernamesInApp = async (
  appConfig: { baseURI: string; path: string },
  users: [{ _id: string; username: string }],
  bearerToken: string,
): Promise<{ status: number }> => {
  console.log('appConfig', appConfig);
  console.log('users', users);
  return axios.put(
    `${appConfig.baseURI}${appConfig.path}`,
    { users },
    {
      headers: {
        Authorization: `${bearerToken}`,
      },
    },
  );
};

/**
 * "updateUsernames" receives an array of SSO ids and new usernames,
 * changing the usernames of these users. It then notifies other
 * apps that use MT-SSO (right now, only VMT and EnCOMPass) about the
 * changes because every app keeps usernames in its own database.
 *
 * @TODO Not good to hardwire the apps that need to be notified. A better
 * approach would be to use a Publish/Subscribe model (every app subscribes
 * to username changes with MT-SSO) or have the MT-SSO db be the only
 * source of usernames.
 *
 * @PARAM: users is an array of objects as shown below
 * @RETURN: a promise that resolves to the bulkWrite result of updating the usernames
 *
 * users: [
 *   {
 *     _id: string;
 *     username: string;
 *   }
 * ],
 */

export const updateUsernames = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  const { users, app } = req.body;
  const bearerToken = req.headers['authorization'] || '';

  try {
    const bulkOps = users.map(
      (user: { _id: string; username: string }): {} => {
        return {
          updateOne: {
            filter: { _id: new ObjectId(user._id) },
            update: { username: user.username },
          },
        };
      },
    );
    await User.bulkWrite(bulkOps);

    const otherApps = APPS.filter(
      appConfig => !appConfig.baseURI.includes(app),
    );
    const results = await Promise.all(
      otherApps.map((appConfig: { baseURI: string; path: string }) =>
        updateUsernamesInApp(appConfig, users, bearerToken),
      ),
    );
    console.log('results from other apps', results);
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    if (results.some(result => result.status !== 200))
      console.log('Problem updating usernames in other apps');
    res.json({ isSuccess: true });
  } catch (err) {
    console.error(err);
    next(createError(500, 'Error updating usernames'));
  }
};

const VMT_URI = process.env.VMT_URL;
const ENC_URI = process.env.ENC_URL;
export const updateUsername = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  try {
    console.log('updateUsername', req.params.id, req.body.username);
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
    next(createError(500, 'Error updating usernames'));
  }
};
