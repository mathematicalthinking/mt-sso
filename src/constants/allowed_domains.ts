export function getAllowedOauthRedirectUrls(): (string | undefined)[] {
  return [
    process.env.ENC_URL,
    `${process.env.VMT_URL}${process.env.VMT_OAUTH_SUCCESS_REDIRECT_PATH}`,
  ].filter((url): boolean => url !== undefined);
}

export default getAllowedOauthRedirectUrls();
