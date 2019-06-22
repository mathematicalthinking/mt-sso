const router = require('express').Router();
const {
  resetPassword,
  resetPasswordById,
  validateResetToken,
} = require('../controllers/resetPassword');

router.post('/password/:token', resetPassword);
router.post('/password/user', resetPasswordById);
router.get('/password/:token', validateResetToken);
module.exports = router;
