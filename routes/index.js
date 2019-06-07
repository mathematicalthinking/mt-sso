const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.cookie('redirectURL', req.query.redirectURL);
  res.render('index', {
    title: 'Mathematical Thinking',
  });
});

module.exports = router;
