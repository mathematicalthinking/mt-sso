const express = require('express');
const router = express.Router();

const { getUser, getAuthRedirectURL } = require('../middleware/user-auth');
const { getEncUrl, getVmtUrl } = require('../config/app_urls');

/* GET home page. */
router.get('/', function(req, res, next) {
  let user = getUser(req);
  let vmtUrl = getVmtUrl();
  let encUrl = getEncUrl();

  if (!user) {
    return res.render('index', {
      title: 'Mathematical Thinking',
    });
  }

  let redirectURL = getAuthRedirectURL(req);

  if (redirectURL) {
    res.redirect(redirectURL);
  }

  let displayName = user.firstName ? user.firstName : user.username;

  return res.render('home', {
    title: 'Mathematical Thinking',
    user,
    encUrl,
    vmtUrl,
    displayName,
  });
});

module.exports = router;
