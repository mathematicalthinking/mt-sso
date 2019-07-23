import { EmailTemplateHash, UserDocument } from '../types';

interface EmailTemplateParams {
  recipient: string;
  host: string;
  token: string | null;
  user: UserDocument | null;
  sender: string;
  appName: string;
}

type EmailTemplateGenerator = (
  recipient: string,
  host: string,
  token: string | null,
  user: UserDocument,
  sender: string,
  appName: string,
) => EmailTemplateHash;

export const resetTokenEmail: EmailTemplateGenerator = function(
  recipient: string,
  host: string,
  token: string | null,
  user: UserDocument,
  sender: string,
  appName: string,
): EmailTemplateHash {
  let isVmt = appName === 'Virtual Math Teams';
  let authEndpoint = isVmt ? 'resetPassword' : '#/auth/reset';

  return {
    to: recipient,
    from: sender,
    subject: `Request to reset your ${appName} password`,
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
    Please click on the following link, or paste this into your browser to complete the process: ${host}/${authEndpoint}/${token}
    If you did not request this, please ignore this email and your password will remain unchanged.`,
  };
};

export const confirmEmailAddress: EmailTemplateGenerator = function(
  recipient: string,
  host: string,
  token: string | null,
  user: UserDocument,
  sender: string,
  appName: string,
): EmailTemplateHash {
  let isVmt = appName === 'Virtual Math Teams';
  let authEndpoint = isVmt ? 'confirmEmail' : '#/auth/confirm';

  return {
    to: recipient,
    from: sender,
    subject: `Please confirm your ${appName} email address`,
    text: `You are receiving this because you (or someone else) have signed up for an ${appName} account.
    Please click on the following link, or paste it into your browser to confirm your email address: ${host}/${authEndpoint}/${token}

    Once your email address is confirmed, the final step is for an administrator to approve and authorize your account.

    If you did not sign up for an ${appName} account, please contact an administrator at ${sender}.`,
  };
};

export const newlyAuthorized: EmailTemplateGenerator = function(
  recipient: string,
  host: string,
  token: string | null,
  user: UserDocument,
  sender: string,
  appName: string,
): EmailTemplateHash {
  return {
    to: recipient,
    from: sender,
    subject: `You have been authorized as an ${appName} user!`,
    text: `Congratulations! Your ${appName} account has been authorized. Please visit ${host}/ to login and begin exploring the software.

    If you did not sign up for an ${appName} account, please contact an administrator at ${sender}.`,
  };
};

export const newUserNotification: EmailTemplateGenerator = function(
  recipient: string,
  host: string,
  token: string | null,
  user: UserDocument,
  sender: string,
  appName: string,
): EmailTemplateHash {
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

export default {
  resetTokenEmail,
  confirmEmailAddress,
  newlyAuthorized,
  newUserNotification,
};
