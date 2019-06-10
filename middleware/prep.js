const allowedDomains = require('../constants/allowed_domains');
const { defaults } = require('lodash');

const prepareRedirectURL = (req, res, next) => {
  let { redirectURL } = req.query;

  let redirectApp = allowedDomains[redirectURL];

  let authRedirectURL = redirectApp === undefined ? '/' : redirectURL;

  // set redirectURL on req
  res.cookie('mt_sso_redirect', authRedirectURL);
  next();
};

const prep = (req, res, next) => {
  defaults(req, { mt: {} });
  defaults(req.mt, { auth: {} });

  return next();
};

module.exports.prepareRedirectURL = prepareRedirectURL;
module.exports.prep = prep;
