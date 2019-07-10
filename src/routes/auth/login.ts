import * as express from 'express';
import { jwtLogin } from '../../controllers/localLogin';
import validator from '../../validators/login';

const router: express.Router = express.Router();

router.post('/', validator, jwtLogin);

export default router;
