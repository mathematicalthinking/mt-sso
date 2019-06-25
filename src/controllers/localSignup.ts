import * as bcrypt from 'bcrypt';
import * as express from 'express';
import axios, { AxiosResponse } from 'axios';
import User from '../models/User';

import { generateToken, getUser } from '../middleware/user-auth';
import { getEncUrl, getVmtUrl } from '../config/app_urls';
import { generateAPIToken } from '../utilities/jwt';
import {
  UserDocument,
  EncUserDocument,
  VmtUserDocument,
  SignUpDetails,
  EncSignUpDetails,
  VmtSignupDetails,
} from '../types';

const MIN_PASS_LENGTH = 4;

function validateEmailAddress(email: string): boolean {
  let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}

const createMtUser = (userDetails: SignUpDetails): Promise<UserDocument> => {
  return User.create(userDetails);
};

const createEncUser = async (
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
  } = mtUser;

  let {
    organization,
    organizationRequest,
    location,
    isAuthorized,
    requestReason,
    createdBy,
    authorizedBy,
    isEmailConfirmed,
    accountType,
  } = requestBody;

  let allowedAccountTypes = ['S', 'T', 'P', 'A'];
  let isValidEncAccountType = allowedAccountTypes.includes(accountType);

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
    accountType: isValidEncAccountType ? accountType : 'T',
    createdBy,
    authorizedBy,
    isEmailConfirmed,
    actingRole: 'teacher',
    createDate: createdAt,
    lastModifiedDate: updatedAt,
  };

  let encApiUrl = `${getEncUrl()}/auth/newMtUser`;

  let config = {
    headers: { Authorization: 'Bearer ' + apiToken },
  };

  return axios.post(encApiUrl, encUserBody, config).then(
    (results: AxiosResponse<any>): EncUserDocument => {
      return results.data;
    }
  );
};

const createVmtUser = (
  mtUser: UserDocument,
  requestBody: any,
  apiToken: string
): Promise<VmtUserDocument> => {
  let { firstName, lastName, username, email, _id } = mtUser;

  let { accountType } = requestBody;

  let allowedAccountTypes = ['facilitator', 'participant'];

  if (!allowedAccountTypes.includes(accountType)) {
    accountType = 'facilitator';
  }

  let vmtUserBody: VmtSignupDetails = {
    firstName,
    lastName,
    username,
    email,
    mtUserId: _id,
    accountType,
  };

  let vmtApiUrl = `${getVmtUrl()}/auth/newMtUser`;
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
