import { Router } from 'express';

import * as ctrl from '../../controllers/resetPassword';
import { validateBasicToken } from '../../validators/base';
import {
  validateResetPasswordByToken,
  validateResetPasswordById,
} from '../../validators/resetPassword';

const router = Router();

router.post(
  '/password/:token',
  validateBasicToken,
  validateResetPasswordByToken,
  ctrl.resetPassword,
);
router.post(
  '/password/user',
  validateResetPasswordById,
  ctrl.resetPasswordById,
);

router.get('/password/:token', validateBasicToken, ctrl.validateResetToken);

export default router;
