const express = require('express');
const router = express.Router();

const controller = require('../controllers/forgotPassword');
router.post('/password', controller);

module.exports = router;
