import * as express from 'express';

import localLogin from './login';
import forgot from './forgot';
import logout from './logout';
import oauth from './oauth';
import reset from './reset';
import signup from './signup';

const router = express.Router();

router.use('/login', localLogin);
router.use('/signup', signup);
router.use('/oauth', oauth);
router.use('/logout', logout);
router.use('/forgot', forgot);
router.use('/reset', reset);

export default router;
