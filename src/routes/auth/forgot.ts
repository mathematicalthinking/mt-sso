import { Router } from 'express';
const router = Router();

import { forgotPassword } from '../../controllers/forgotPassword';
router.post('/password', forgotPassword);

export default router;
