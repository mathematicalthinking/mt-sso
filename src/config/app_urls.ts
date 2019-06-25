export const getEncUrl = (): string | undefined => {
  let envName = process.env.NODE_ENV;

  if (envName === 'production') {
    return process.env.ENC_URL_PROD;
  }

  if (envName === 'staging') {
    return process.env.ENC_URL_STAGING;
  }

  if (envName === 'test') {
    return process.env.ENC_URL_TEST;
  }
  return process.env.ENC_URL_DEV;
};

export const getVmtUrl = (): string | undefined => {
  let envName = process.env.NODE_ENV;

  if (envName === 'production') {
    return process.env.VMT_URL_PROD;
  }

  if (envName === 'staging') {
    return process.env.VMT_URL_STAGING;
  }
  return process.env.VMT_URL_DEV;
};

export const appDisplayNamesHash = {
  vmt: 'VMT',
  encompass: 'EnCoMPASS',
  mtsso: 'Mathematical Thinking',
};

export const getAppHost = (appName: string): string | undefined => {
  if (appName === appDisplayNamesHash.encompass) {
    return getEncUrl();
  }
  if (appName === appDisplayNamesHash.vmt) {
    return getVmtUrl();
  }
};

export default {
  getEncUrl,
  getVmtUrl,
  appDisplayNamesHash,
  getAppHost,
};
