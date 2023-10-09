import { Router } from 'express';
const router = Router();

import * as controller from '../../controllers/user';

router.put('/:id', controller.put);
router.put('/:id/name', controller.updateUserName);

export default router;
