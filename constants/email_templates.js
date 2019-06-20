const resetTokenEmail = function(
  recipient,
  host,
  token,
  user,
  sender,
  appName
) {
  if (!recipient) {
    return;
  }
  return {
    to: recipient,
    from: sender,
    subject: `Request to reset your ${appName} password`,
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
    Please click on the following link, or paste this into your browser to complete the process: ${host}/#/auth/reset/${token}
    If you did not request this, please ignore this email and your password will remain unchanged.`,
  };
};

const confirmEmailAddress = function(
  recipient,
  host,
  token,
  user,
  sender,
  appName
) {
  if (!recipient) {
    return;
  }
  return {
    to: recipient,
    from: sender,
    subject: `Please confirm your ${appName} email address`,
    text: `You are receiving this because you (or someone else) have signed up for an ${appName} account.
    Please click on the following link, or paste it into your browser to confirm your email address: ${host}/#/auth/confirm/${token}

    Once your email address is confirmed, the final step is for an administrator to approve and authorize your account.

    If you did not sign up for an ${appName} account, please contact an administrator at ${sender}.`,
  };
};

const newlyAuthorized = function(
  recipient,
  host,
  token,
  user,
  sender,
  appName
) {
  if (!recipient) {
    return;
  }
  return {
    to: recipient,
    from: sender,
    subject: `You have been authorized as an ${appName} user!`,
    text: `Congratulations! Your ${appName} account has been authorized. Please visit ${host}/ to login and begin exploring the software.

    If you did not sign up for an ${appName} account, please contact an administrator at ${sender}.`,
  };
};

const newUserNotification = function(
  recipient,
  host,
  token,
  user,
  sender,
  appName
) {
  if (!recipient) {
    return;
  }
  let username;

  if (user) {
    username = user.username;
  } else {
    username = '';
  }

  return {
    to: recipient,
    from: sender,
    subject: `A new user has registered an ${appName} account`,
    text: `A new user (username: ${username}) just signed up for an ${appName} account and is waiting to be authorized. Please visit ${host}/ to login and navigate to the users portal to view users that are waiting for authorization.`,
  };
};

module.exports.resetTokenEmail = resetTokenEmail;
module.exports.confirmEmailAddress = confirmEmailAddress;
module.exports.newlyAuthorized = newlyAuthorized;
module.exports.newUserNotification = newUserNotification;
