const getEncUrl = () => {
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

const getVmtUrl = () => {
  let envName = process.env.NODE_ENV;

  if (envName === 'production') {
    return process.env.VMT_URL_PROD;
  }

  if (envName === 'staging') {
    return process.env.VMT_URL_STAGING;
  }
  return process.env.VMT_URL_DEV;
};

module.exports.appDisplayNamesHash = {
  vmt: 'VMT',
  encompass: 'EnCoMPASS',
  mtsso: 'Mathematical Thinking',
};

module.exports.getAppHost = appName => {
  if (appName === this.appDisplayNamesHash.encompass) {
    return getEncUrl();
  }
  if (appName === this.appDisplayNamesHash.vmt) {
    return getVmtUrl();
  }
};

module.exports.getEncUrl = getEncUrl;
module.exports.getVmtUrl = getVmtUrl;
