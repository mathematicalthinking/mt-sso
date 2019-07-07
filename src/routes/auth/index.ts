import express from 'express';

import localLogin from './login';
import forgot from './forgot';
import oauth from './oauth';
import reset from './reset';
import signup from './signup';
import accessToken from './accessToken';

const router = express.Router();

router.use('/login', localLogin);
router.use('/signup', signup);
router.use('/oauth', oauth);
router.use('/forgot', forgot);
router.use('/reset', reset);
router.use('/accessToken', accessToken);

export default router;
