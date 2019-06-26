import * as express from 'express';

import { jwtLogin } from '../../controllers/localLogin';

const router: express.Router = express.Router();

router.post('/', jwtLogin);

export default router;
