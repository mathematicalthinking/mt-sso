const express = require('express');
const router = express.Router();

const localSignup = require('../controllers/localSignup');

router.get('/', (req, res, next) => {
  res.render('signup', {
    title: 'Sign Up for a Mathematical Thinking Account',
    explanation:
      'Both EnCOMPASS and VMT accounts will be automatically created for you',
  });
});

router.post('/', localSignup);

module.exports = router;
