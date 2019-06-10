const express = require('express');
const router = express.Router();

const { getUser } = require('../middleware/user-auth');
const { getEncUrl, getVmtUrl } = require('../middleware/app_urls');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.cookie('redirectURL', req.query.redirectURL);

  let user = getUser(req);
  let vmtUrl = getVmtUrl();
  let encUrl = getEncUrl();

  if (!user) {
    return res.render('index', {
      title: 'Mathematical Thinking',
    });
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
