const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.clearCookie('mtToken');
  res.clearCookie('redirectURL');
  res.redirect('/');
});

module.exports = router;
