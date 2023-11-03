import express from 'express';

import localLogin from './login';
import forgot from './forgot';
import reset from './reset';
import signup from './signup';
import accessToken from './accessToken';
import confirmEmail from './confirmEmail';
import user from './user';
import revokedToken from './revokedToken';

const router = express.Router();

router.use('/login', localLogin);
router.use('/signup', signup);
router.use('/forgot', forgot);
router.use('/reset', reset);
router.use('/accessToken', accessToken);
router.use('/confirmEmail', confirmEmail);
router.use('/user', (req, res, next) => {
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  user(req, res, next);
});
router.use('/revokedToken', revokedToken);

export default router;
