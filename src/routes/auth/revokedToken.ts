import { Router } from 'express';
const router = Router();

import * as controller from '../../controllers/revokedToken';

router.post('/', controller.revokeToken);
export default router;
