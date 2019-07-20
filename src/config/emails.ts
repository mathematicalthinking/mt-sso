import { appDisplayNamesHash } from './app_urls';

export const getEmailAuth = function(
  appName: string,
): { username: string | undefined; password: string | undefined } {
  let username;
  let password;

  if (appName === appDisplayNamesHash.encompass) {
    username = process.env.ENC_GMAIL_USERNAME;
    password = process.env.ENC_GMAIL_PASSWORD;
  } else if (appName === appDisplayNamesHash.vmt) {
    username = process.env.VMT_GMAIL_USERNAME;
    password = process.env.VMT_GMAIL_PASSWORD;
  }

  return { username, password };
};

export const CONFIRM_EMAIL_TOKEN_EXPIRY = 86400000; // 1 day
