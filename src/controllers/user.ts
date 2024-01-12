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
 *
 *  @TODO Not good to hardwire the apps that need to be notified. A better
 * approach would be to use a Publish/Subscribe model (i.e., every app subscribes
 * to username changes with MT-SSO) or have the MT-SSO db be the only
 * source of usernames.
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
): Promise<{ status: number; error?: string }> => {
  try {
    const response = await axios.put(
      `${appConfig.baseURI}${appConfig.path}`,
      { users },
      {
        headers: {
          Authorization: `${bearerToken}`,
        },
      },
    );
    return { status: response.status };
  } catch (error) {
    console.error('Error in updateUsernamesInApp:', error);
    console.log('URI:', `${appConfig.baseURI}${appConfig.path}`);
    console.log('users', users);
    return { status: 500, error: 'Error occurred during axios request' };
  }
};

/**
 * "updateUsernames" receives an array of SSO ids and new usernames,
 * changing the usernames of these users. It then notifies other
 * apps that use MT-SSO (right now, only VMT and EnCOMPass) about the
 * changes because every app keeps usernames in its own database.
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
    await Promise.all(
      otherApps.map((appConfig: { baseURI: string; path: string }) =>
        updateUsernamesInApp(appConfig, users, bearerToken),
      ),
    );
    res.json({ isSuccess: true });
  } catch (err) {
    console.error(err);
    next(createError(500, 'Error updating usernames'));
  }
};
