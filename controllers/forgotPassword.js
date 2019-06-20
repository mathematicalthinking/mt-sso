const { getResetToken } = require('../utilities/tokens');
const User = require('../models/User');
const { sendEmailSMTP } = require('../utilities/emails');
const { getVerifiedApiJWT } = require('../utilities/jwt');

const errors = require('../utilities/errors');

const { getIssuerName } = require('../config/jwt_issuers');
const { getAppHost } = require('../config/app_urls');

module.exports = async function(req, res, next) {
  let token;
  let user;

  try {
    let verifiedJWTPayload = await getVerifiedApiJWT(req);

    if (verifiedJWTPayload === null) {
      return errors.sendError.NotAuthorizedError(null, res);
    }

    let appName = getIssuerName(verifiedJWTPayload.iss);

    if (appName === null) {
      return errors.sendError.NotAuthorizedError(null, res);
    }

    let host = getAppHost(appName);

    token = await getResetToken(20);

    let { email, username } = req.body;

    if (email) {
      user = await User.findOne({ email });
      if (!user) {
        const msg = {
          info: `There is no ${appName} account associated with that email address`,
          isSuccess: false,
        };
        return res.json(msg);
      }
    } else if (username) {
      user = await User.findOne({ username });
      if (!user) {
        const msg = {
          info: `There is no ${appName} account associated with that username`,
          isSuccess: false,
        };
        return res.json(msg);
      }
    }

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();
    // should we assume all users have emails?
    if (!email) {
      if (user.email) {
        email = user.email;
      } else {
        const msg = {
          info: `You must have an email address associated with your ${appName} account in order to reset your password`,
          isSuccess: false,
        };
        return res.json(msg);
      }
    }

    await sendEmailSMTP(email, host, 'resetTokenEmail', token, user, appName);

    return res.json({
      info: `Password reset email sent to ${email}`,
      isSuccess: true,
    });
  } catch (err) {
    console.error(`Error auth/forgot: ${err}`);
    console.trace();
    return res.status(500).json({ message: err.message });
  }
};
