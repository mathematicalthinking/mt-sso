import { appDisplayNamesHash } from './app_urls';

export const getEmailAuth = function(
  appName: string
): { username: string | undefined; password: string | undefined } {
  let env = process.env.NODE_ENV;
  let username;
  let password;

  if (env === 'test') {
    if (appName === appDisplayNamesHash.encompass) {
      username = process.env.ENC_TEST_GMAIL_USERNAME;
      password = process.env.ENC_TEST_GMAIL_PASSWORD;
    } else if (appName === appDisplayNamesHash.vmt) {
      username = process.env.VMT_TEST_GMAIL_USERNAME;
      password = process.env.VMT_TEST_GMAIL_PASSWORD;
    }
  } else {
    if (appName === appDisplayNamesHash.encompass) {
      username = process.env.ENC_GMAIL_USERNAME;
      password = process.env.ENC_GMAIL_PASSWORD;
    } else if (appName === appDisplayNamesHash.vmt) {
      username = process.env.VMT_GMAIL_USERNAME;
      password = process.env.VMT_GMAIL_PASSWORD;
    }
  }
  return { username, password };
};
