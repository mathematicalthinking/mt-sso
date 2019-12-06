import express from 'express';

import localLogin from './login';
import forgot from './forgot';
import reset from './reset';
import signup from './signup';
import accessToken from './accessToken';
import confirmEmail from './confirmEmail';
import user from './user';

const router = express.Router();

router.use('/login', localLogin);
router.use('/signup', signup);
router.use('/forgot', forgot);
router.use('/reset', reset);
router.use('/accessToken', accessToken);
router.use('/confirmEmail', confirmEmail);
router.use('/user', user);

export default router;
