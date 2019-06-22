const bcrypt = require('bcrypt');

const User = require('../models/User');
const errors = require('../utilities/errors');
const { getUser } = require('../middleware/user-auth');
const { generateSSOToken } = require('../utilities/jwt');
const { getVerifiedApiJWT } = require('../utilities/jwt');

module.exports.validateResetToken = async (req, res, next) => {
  try {
    let verifiedJWTPayload = await getVerifiedApiJWT(req);

    if (verifiedJWTPayload === null) {
      return errors.sendError.NotAuthorizedError(null, res);
    }

    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.json({
        info: 'Password reset token is invalid or has expired',
        isValid: false,
      });
    }
    return res.json({ info: 'valid token', isValid: true });
  } catch (err) {
    return errors.sendError.InternalError(err, res);
  }
};
module.exports.resetPassword = async (req, res, next) => {
  try {
    let verifiedJWTPayload = await getVerifiedApiJWT(req);

    if (verifiedJWTPayload === null) {
      return errors.sendError.NotAuthorizedError(null, res);
    }

    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.json({
        info: 'Password reset token is invalid or has expired.',
      });
    }

    const hashPass = await bcrypt.hash(
      req.body.password,
      bcrypt.genSaltSync(12)
    );
    user.password = hashPass;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    let mtToken = await generateSSOToken(user);

    return res.json({
      user,
      mtToken,
    });
  } catch (err) {
    console.error(`Error resetPassword: ${err}`);
    console.trace();
    return errors.sendError.InternalError(err, res);
  }
};
module.exports.resetPasswordById = async (req, res, next) => {
  try {
    let verifiedJWTPayload = await getVerifiedApiJWT(req);

    if (verifiedJWTPayload === null) {
      return errors.sendError.NotAuthorizedError(null, res);
    }

    const reqUser = getUser(req);

    const { id, password } = req.body;

    if (!id || !password) {
      const err = {
        info: 'Invalid user id or password',
      };
      return errors.sendError.InvalidArgumentError(err, res);
    }

    const user = await User.findById(id);
    if (!user) {
      return res.json({
        info: 'Cannot find user',
      });
    }

    const hashPass = await bcrypt.hash(password, bcrypt.genSaltSync(12));

    user.password = hashPass;
    user.lastModifiedBy = reqUser._id;

    // should we store most recent password and block that password in future? or all past passwords and block all of them?

    await user.save();

    return res.json(user);
  } catch (err) {
    return errors.sendError.InternalError(err, res);
  }
};
