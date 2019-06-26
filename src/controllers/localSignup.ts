import * as bcrypt from 'bcrypt';
import * as express from 'express';
import axios, { AxiosResponse } from 'axios';
import User from '../models/User';

import { generateToken, getUser } from '../middleware/user-auth';
import { generateAPIToken } from '../utilities/jwt';
import {
  UserDocument,
  EncUserDocument,
  VmtUserDocument,
  SignUpDetails,
  EncSignUpDetails,
  VmtSignupDetails,
  VmtAccountType,
  EncAccountType,
} from '../types';

const MIN_PASS_LENGTH = 4;

function validateEmailAddress(email: string): boolean {
  let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}

const resolveVmtAccountType = (
  mtUser: UserDocument,
  requestBody: any
): string => {
  let isGoogleSignup = mtUser.googleId !== undefined;

  if (isGoogleSignup) {
    // default to facilitator for google signups
    return VmtAccountType.facilitator;
  }

  let accountType;

  accountType = VmtAccountType[requestBody.accountType];

  // default to facilitator if not valid vmt account
  // i.e. if request originated from encompass
  return accountType === undefined ? VmtAccountType.facilitator : accountType;
};

const resolveEncAccountType = (
  mtUser: UserDocument,
  requestBody: any
): string => {
  let isGoogleSignup = mtUser.googleId !== undefined;

  if (isGoogleSignup) {
    // default to teacher for google signups
    return EncAccountType.T;
  }

  let accountType;

  accountType = EncAccountType[requestBody.accountType];

  // default to teacher if not valid enc account type
  // i.e. if request originated from vmt
  return accountType === undefined ? EncAccountType.T : accountType;
};

const createMtUser = (userDetails: SignUpDetails): Promise<UserDocument> => {
  return User.create(userDetails);
};

export const createEncUser = async (
  mtUser: UserDocument,
  requestBody: any,
  apiToken: string
): Promise<EncUserDocument> => {
  let {
    firstName,
    lastName,
    username,
    email,
    _id,
    createdAt,
    updatedAt,
    isEmailConfirmed,
  } = mtUser;

  let {
    organization,
    organizationRequest,
    location,
    isAuthorized,
    requestReason,
    createdBy,
    authorizedBy,
  } = requestBody;

  let accountType = resolveEncAccountType(mtUser, requestBody);

  let encUserBody: EncSignUpDetails = {
    firstName,
    lastName,
    username,
    email,
    mtUserId: _id,
    organization,
    organizationRequest,
    location,
    isAuthorized,
    requestReason,
    accountType,
    createdBy,
    authorizedBy,
    isEmailConfirmed,
    actingRole: accountType === 'S' ? 'student' : 'teacher',
    createDate: createdAt,
    lastModifiedDate: updatedAt,
  };

  // Should we use create date of SSO account? or Date.now()? ...

  let encApiUrl = `${process.env.ENC_URL}/auth/newMtUser`;

  let config = {
    headers: { Authorization: 'Bearer ' + apiToken },
  };

  return axios.post(encApiUrl, encUserBody, config).then(
    (results: AxiosResponse<any>): EncUserDocument => {
      return results.data;
    }
  );
};

export const createVmtUser = (
  mtUser: UserDocument,
  requestBody: any,
  apiToken: string
): Promise<VmtUserDocument> => {
  let { firstName, lastName, username, email, _id, isEmailConfirmed } = mtUser;

  let accountType = resolveVmtAccountType(mtUser, requestBody);

  let vmtUserBody: VmtSignupDetails = {
    firstName,
    lastName,
    username,
    email,
    mtUserId: _id,
    accountType,
    isEmailConfirmed,
  };

  let vmtApiUrl = `${process.env.VMT_URL}/auth/newMtUser`;
  let config = {
    headers: { Authorization: 'Bearer ' + apiToken },
  };

  return axios.post(vmtApiUrl, vmtUserBody, config).then(
    (results: AxiosResponse<any>): VmtUserDocument => {
      return results.data;
    }
  );
};

const localSignup = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    let currentUser = getUser(req);

    // Do not want to login a user who is being created by a currently logged in user
    // Currently only comes from encompass

    let doLoginNewUser = currentUser === undefined;

    let { firstName, lastName, username, password, email } = req.body;

    if (typeof username !== 'string') {
      let message = 'Invalid Username';
      res.json({ message });
      return;
    }

    let prunedUsername = username.trim().toLowerCase();

    let filter: any = { username: prunedUsername };

    let isEmailValid = validateEmailAddress(email);

    if (isEmailValid) {
      filter = {
        $or: [{ username: prunedUsername }, { email }],
      };
    }
    let existingUser = await User.findOne(filter);
    if (existingUser !== null) {
      // Username or email is taken
      let isUsernameTaken = existingUser.username === prunedUsername;

      let noun = isUsernameTaken ? 'username' : 'email address';
      let message = `There already exists a user with that ${noun}`;
      res.json({ message, existingUser });
      return;
    }

    if (typeof password !== 'string' || password.length < MIN_PASS_LENGTH) {
      let message = 'Invalid Password';
      res.json({ message });
      return;
    }

    let hashedPass = await bcrypt.hash(password, 12);

    let mtUser = await createMtUser({
      firstName,
      lastName,
      password: hashedPass,
      email,
      username,
    });

    let apiToken = await generateAPIToken(mtUser._id);

    let [encUser, vmtUser] = await Promise.all([
      createEncUser(mtUser, req.body, apiToken),
      createVmtUser(mtUser, req.body, apiToken),
    ]);

    mtUser.encUserId = encUser._id;
    mtUser.vmtUserId = vmtUser._id;

    await mtUser.save();

    let mtToken;

    if (doLoginNewUser) {
      mtToken = await generateToken(mtUser);
      res.cookie('mtToken', mtToken);
    }

    let results = {
      mtToken,
      encUser,
      vmtUser,
    };
    res.json(results);
  } catch (err) {
    res.json({ errorMessage: err.message });
  }

  // mandatory fields for both encompass and vmt
  // first name
  // last name
  // username
  // password
  // email (unless encompass student)

  // mandatory encompass fields
  // organization or organization request
  // request reason
  // agreed to terms
  // location

  // mandatory vmt fields
  // account type (facilitator or participant)
};

export default localSignup;
