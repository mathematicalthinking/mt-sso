const { appDisplayNamesHash } = require('./app_urls');

module.exports.getEncIssuerId = () => {
  let envName = process.env.NODE_ENV;

  if (envName === 'production') {
    return process.env.ENC_JWT_ISSUER_ID_PROD;
  }

  if (envName === 'staging') {
    return process.env.ENC_JWT_ISSUER_ID_STAGING;
  }

  if (envName === 'test') {
    return process.env.ENC_JWT_ISSUER_ID_TEST;
  }

  return process.env.ENC_JWT_ISSUER_ID_DEV;
};

module.exports.getVmtIssuerId = () => {
  let envName = process.env.NODE_ENV;

  if (envName === 'production') {
    return process.env.VMT_JWT_ISSUER_ID_PROD;
  }

  if (envName === 'staging') {
    return process.env.VMT_JWT_ISSUER_ID_STAGING;
  }

  if (envName === 'test') {
    return process.env.VMT_JWT_ISSUER_ID_TEST;
  }

  return process.env.VMT_JWT_ISSUER_ID_DEV;
};

module.exports.getMtIssuerId = () => {
  let envName = process.env.NODE_ENV;

  if (envName === 'production') {
    return process.env.JWT_ISSUER_ID_PROD;
  }

  if (envName === 'staging') {
    return process.env.JWT_ISSUER_ID_STAGING;
  }

  if (envName === 'test') {
    return process.env.JWT_ISSUER_ID_TEST;
  }

  return process.env.JWT_ISSUER_ID_DEV;
};

module.exports.getIssuerName = issuerId => {
  let encId = this.getEncIssuerId();
  let vmtId = this.getVmtIssuerId();
  let mtSsoId = this.getMtIssuerId();

  if (encId === issuerId) {
    return appDisplayNamesHash.encompass;
  }

  if (vmtId === issuerId) {
    return appDisplayNamesHash.vmt;
  }

  if (mtSsoId === issuerId) {
    return appDisplayNamesHash.mtsso;
  }

  return null;
};
