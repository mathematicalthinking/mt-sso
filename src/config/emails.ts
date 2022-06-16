
export const getEmailAuth = function(
  appName: string,
): { username: string | undefined; password: string | undefined } {
  return {
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
  };
};

export const CONFIRM_EMAIL_TOKEN_EXPIRY = 31557600000; // 1 year
