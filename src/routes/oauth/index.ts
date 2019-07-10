import express from 'express';
import google from './google';

const router = express.Router();

router.use('/google', google);

export default router;
