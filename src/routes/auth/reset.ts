import { Router } from 'express';

import * as ctrl from '../../controllers/resetPassword';

const router = Router();

router.post('/password/:token', ctrl.resetPassword);
router.post('/password/user', ctrl.resetPasswordById);
router.get('/password/:token', ctrl.validateResetToken);

export default router;
