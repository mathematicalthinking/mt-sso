import { EmailTemplateHash, UserDocument } from '../types';
import { AppNames } from '../config/app_urls';

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
  let isVmt = appName === AppNames.Vmt;
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
  let isVmt = appName === AppNames.Vmt;
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
  let { username } = user;

  let isVmt = appName === AppNames.Vmt;
  let appNameModifier = isVmt ? 'a' : 'an';
  let subject = `A new user has registered for ${appNameModifier} ${appName} account`;
  let isGoogleUser = typeof user.googleId === 'string';
  let registerDesc = isGoogleUser ? 'signed up via Google' : 'signed up';
  let msg;

  if (isVmt) {
    msg = `A new user (username: ${username}) has ${registerDesc} for a ${appName} account and is now authorized. Please visit ${host}/ for further review.`;
  } else {
    msg = `A new user (username: ${username}) has ${registerDesc} for an ${appName} account and is waiting to be authorized. Please visit ${host}/ to login and navigate to the users portal to view users that are waiting for authorization.`;
  }

  return {
    to: recipient,
    from: sender,
    subject,
    text: msg,
  };
};

export const googleSignup: EmailTemplateGenerator = function(
  recipient: string,
  host: string,
  token: string | null,
  user: UserDocument,
  sender: string,
  appName: string,
): EmailTemplateHash {
  let isVmt = appName === AppNames.Vmt;
  let appNameModifier = isVmt ? 'a' : 'an';

  return {
    to: recipient,
    from: sender,
    subject: `You have signed up for ${appName} through google`,
    text: `Congratulations! You have successfully signed up for ${appNameModifier} ${appName} account through your google account (${
      user.email
    }). This email is the username of your new account. Please visit ${host}/ to login and begin exploring the software.

    If you did not sign up for ${appNameModifier} ${appName} account, please contact an administrator at ${sender}.`,
  };
};

export default {
  resetTokenEmail,
  confirmEmailAddress,
  newlyAuthorized,
  newUserNotification,
  googleSignup,
};
