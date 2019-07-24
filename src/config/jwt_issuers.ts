import { AppNames } from '../config/app_urls';

const issuers = {
  [process.env.ENC_JWT_ISSUER_ID]: {
    name: AppNames.Enc,
    url: process.env.ENC_URL,
  },
  [process.env.VMT_JWT_ISSUER_ID]: {
    name: AppNames.Vmt,
    url: process.env.VMT_URL,
  },
  [process.env.JWT_ISSUER_ID]: {
    name: 'Mathematical Thinking',
  },
};

export const getIssuerName = (issuerId: string): string | undefined => {
  let config = issuers[issuerId];

  if (config === undefined) {
    return;
  }
  return config.name;
};

export const getIssuerHost = (issuerId: string): string | undefined => {
  let config = issuers[issuerId];

  if (config === undefined) {
    return;
  }
  let host = config.url;

  if (host === undefined) {
    return;
  }
  return host;
};
