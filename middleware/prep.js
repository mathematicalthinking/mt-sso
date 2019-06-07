const allowedDomains = require('../constants/allowed_domains');

const prepareRedirectURL = (req, res, next) => {
  let { redirectURL } = req.query;

  let redirectApp = allowedDomains[redirectURL];

  if (redirectApp) {
    // set redirectURL on req
    res.cookie('redirectURL', redirectURL);
  }
  next();
};

module.exports.prepareRedirectURL = prepareRedirectURL;
