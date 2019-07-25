import express from 'express';
const router = express.Router();

import { googleCallback, googleOauth } from '../../controllers/oauth/google';
import { prepareRedirectUrls } from '../../middleware/oauth';

router.get('/', prepareRedirectUrls, googleOauth);

router.get('/callback', googleCallback);

export default router;
