const allowedDomains = require('../constants/allowed_domains');

const prepareRedirectURL = (req, res, next) => {
  let { redirectURL } = req.query;

  let redirectApp = allowedDomains[redirectURL];

  let authRedirectURL = redirectApp === undefined ? '/' : redirectURL;

  // set redirectURL on req
  res.cookie('mt_sso_redirect', authRedirectURL);
  next();
};

module.exports.prepareRedirectURL = prepareRedirectURL;
