const getEncUrl = () => {
  let envName = process.env.NODE_ENV;

  if (envName === 'production') {
    return process.env.ENC_URL_PROD;
  }

  if (envName === 'staging') {
    return process.env.ENC_URL_STAGING;
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

module.exports.getEncUrl = getEncUrl;
module.exports.getVmtUrl = getVmtUrl;
