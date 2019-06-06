const express = require('express');
const router = express.Router();

const localLogin = require('../controllers/localLogin');

router.post('/', localLogin);

module.exports = router;
