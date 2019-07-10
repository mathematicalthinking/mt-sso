import { Router } from 'express';
const router = Router();

import { forgotPassword } from '../../controllers/forgotPassword';
import { validateForgotPasswordRequest } from '../../validators/forgotPassword';

router.post('/password', validateForgotPasswordRequest, forgotPassword);
export default router;
