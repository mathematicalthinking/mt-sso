const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secret = process.env.MT_USER_JWT_SECRET;

const comparePasswords = (candidatePassword, user) => {
  return bcrypt.compare(candidatePassword, user.password);
};

const getUserFromLogin = (username, password) => {
  let usernameLower =
    typeof username === 'string' ? username.toLowerCase() : '';

  return User.findOne({ username: usernameLower })
    .lean()
    .exec()
    .then(userRecord => {
      if (userRecord === null) {
        return {
          errorMessage: 'No user with that username',
          user: null,
        };
      }
      return comparePasswords(password, userRecord).then(isPasswordValid => {
        if (isPasswordValid) {
          return {
            user: userRecord,
            errorMessage: null,
          };
        }

        return {
          errorMessage: 'Invalid password',
          user: null,
        };
      });
    })
    .catch(err => {
      console.error(`Error getUserFromLogin: `, err);
    });
};

const generateToken = async user => {
  let { _id, encUserId, vmtUserId } = user;

  let payload = {
    mtUserId: _id,
    encUserId,
    vmtUserId,
  };
  let options = {
    expiresIn: '1d',
  };

  return jwt.sign(payload, secret, options);
};

module.exports.getUserFromLogin = getUserFromLogin;
module.exports.generateToken = generateToken;
