import { Router } from 'express';
const router = Router();

import * as controller from '../../controllers/user';

router.put('/updateNames/:id', (req, res, next) => {
    console.log('Inside /updateNames route');
    console.log('body', req.body);
    controller.updateUsernames(req, res, next);
  });
router.put('/:id', controller.put);

export default router;
