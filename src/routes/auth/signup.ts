import * as express from 'express';
const router = express.Router();

import localSignup from '../../controllers/localSignup';

router.post('/', localSignup);

export default router;
