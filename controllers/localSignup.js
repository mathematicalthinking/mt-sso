const User = require('../models/User');
const bcrypt = require('bcrypt');
const axios = require('axios');

const { generateToken } = require('../middleware/user-auth');
const { getEncUrl, getVmtUrl } = require('../config/app_urls');

const { generateAPIToken } = require('../utilities/jwt');

const MIN_PASS_LENGTH = 4;

function validateEmailAddress(email) {
  let emailRegex = /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailRegex.test(email);
}

const createMtUser = userDetails => {
  return User.create(userDetails);
};

const createEncUser = async (mtUser, requestBody, apiToken) => {
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
  } = requestBody;

  let encUserBody = {
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
    accountType: 'T',
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

  return axios.post(encApiUrl, encUserBody, config).then(results => {
    return results.data;
  });
};

const createVmtUser = (mtUser, requestBody, apiToken) => {
  let { firstName, lastName, username, email, _id } = mtUser;

  let { accountType } = requestBody;

  let allowedAccountTypes = ['facilitator', 'participant'];

  if (!allowedAccountTypes.includes(accountType)) {
    accountType = 'facilitator';
  }

  let vmtUserBody = {
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

  return axios.post(vmtApiUrl, vmtUserBody, config).then(results => {
    return results.data;
  });
};

const localSignup = async (req, res, next) => {
  try {
    let { firstName, lastName, username, password, email } = req.body;

    if (typeof username !== 'string') {
      let message = 'Invalid Username';
      return res.json({ message });
    }

    let prunedUsername = username.trim().toLowerCase();

    let isEmailValid = validateEmailAddress(email);

    let promises = [
      User.findOne({ username: prunedUsername })
        .lean()
        .exec(),
    ];

    if (isEmailValid) {
      promises.push(
        User.findOne({ email })
          .lean()
          .exec()
      );
    }

    let [existingUsernameUser, existingEmailUser] = await Promise.all(promises);

    let isUsernameTaken = existingUsernameUser !== null;
    let isEmailTaken = isEmailValid && existingEmailUser !== null;

    if (isUsernameTaken || isEmailTaken) {
      // Username is taken
      let noun = isUsernameTaken ? 'username' : 'email address';
      let message = `There already exists a user with that ${noun}`;
      return res.json({ message });
    }

    if (typeof password !== 'string' || password.length < MIN_PASS_LENGTH) {
      let message = 'Invalid Password';
      return res.json({ message });
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

    let mtToken = await generateToken(mtUser);
    res.cookie('mtToken', mtToken);

    let results = {
      mtToken,
    };
    res.json(results);
  } catch (err) {
    console.log('err mt signup', err.message, err);
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

module.exports = localSignup;
