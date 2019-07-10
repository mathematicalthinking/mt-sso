import express from 'express';
const router = express.Router();

import { googleCallback, googleOauth } from '../../controllers/oauth/google';

router.get('/', googleOauth);

router.get('/callback', googleCallback);

export default router;
