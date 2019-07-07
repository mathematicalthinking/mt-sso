import { Router } from 'express';
const router = Router();

import * as controller from '../../controllers/accessToken';
import { validateRefreshToken } from '../../middleware/user-auth';

router.post('/', validateRefreshToken, controller.createNewAccessToken);
export default router;
