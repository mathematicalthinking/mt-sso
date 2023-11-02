import { Router } from 'express';
const router = Router();

import * as controller from '../../controllers/user';

router.put('/updateNames', controller.updateUsernames);
router.put('/:id', controller.put);

export default router;
