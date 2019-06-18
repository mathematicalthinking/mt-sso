const jwt = require('jsonwebtoken');

const SSOSecret = process.env.MT_USER_JWT_SECRET;

const SSO_TOKEN_EXPIRY = '1d';
const API_TOKEN_EXPIRY = 6000; // 30m

const generateSignedJWT = (payload, secret, options) => {
  return jwt.sign(payload, secret, options);
};

module.exports.generateSSOToken = mtUser => {
  let { _id, encUserId, vmtUserId } = mtUser;

  let payload = {
    mtUserId: _id,
    encUserId,
    vmtUserId,
  };
  let options = {
    expiresIn: SSO_TOKEN_EXPIRY,
  };

  return generateSignedJWT(payload, SSOSecret, options);
};

module.exports.generateAPIToken = (mtUserId, expiration = API_TOKEN_EXPIRY) => {
  let payload = { isValid: true, mtUserId };
  let options = { expiresIn: expiration };

  return generateSignedJWT(payload, SSOSecret, options);
};

module.exports.extractBearerToken = req => {
  let { authorization } = req.headers;

  if (typeof authorization !== 'string') {
    return;
  }
  return authorization.split(' ')[1];
};
