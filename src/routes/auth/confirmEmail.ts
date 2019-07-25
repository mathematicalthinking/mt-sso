import { Router } from 'express';
const router = Router();

import { validateBasicToken } from '../../validators/base';
import {
  confirmEmail,
  resendConfirmationEmail,
} from '../../controllers/confirmEmail';
export default router;

router.get('/resend', resendConfirmationEmail);
router.get('/confirm/:token', validateBasicToken, confirmEmail);
