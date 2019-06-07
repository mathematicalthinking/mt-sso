const express = require('express');
const router = express.Router();

const allowedDomains = require('../constants/allowed_domains');

const localLogin = require('../controllers/localLogin');

router.get('/', (req, res, next) => {
  let redirectURL = req.cookies.redirectURL;

  let explanation;

  if (redirectURL) {
    let redirectApp = allowedDomains[redirectURL];
    explanation = `You will be redirected back to ${redirectApp} after logging in.`;
  }

  res.render('login', {
    title: 'Log In to Your Mathematical Thinking Account',
    explanation,
  });
});

router.post('/', localLogin);

module.exports = router;
