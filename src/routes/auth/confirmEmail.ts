import { Router } from 'express';
const router = Router();

import { validateBasicToken } from '../../validators/base';
import { validateConfirmEmailByIdRequest } from '../../validators/confirmEmail';
import {
  confirmEmail,
  resendConfirmationEmail,
  confirmEmailById,
} from '../../controllers/confirmEmail';
export default router;

router.get('/resend', resendConfirmationEmail);
router.post('/confirm/user', validateConfirmEmailByIdRequest, confirmEmailById);
router.get('/confirm/:token', validateBasicToken, confirmEmail);
