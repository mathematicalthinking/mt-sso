export const accessCookie = {
  name: 'mt_sso_ac',
  maxAge: 86400000, // ms (1 day)
};
export const refreshCookie = {
  name: 'mt_sso_rf',
  maxAge: 2592000000, // ms (1 year)
};

export const apiToken = {
  expiresIn: '5m', // 5 minutes (zeit/ms)
};

export const accessToken = {
  expiresIn: '30m', // 30 minutes (zeit/ms)
};
// export const refreshToken = {
//   expiresIn: '2m', // 30 days (zeit/ms)
// };
