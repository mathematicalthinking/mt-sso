import * as express from 'express';
const router = express.Router();
import { version } from '../constants/version';

/* GET home page. */
router.get('/', function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void {
  console.log(`MT-SSO v.${version}, redirecting...`);
  res.redirect(process.env.DEFAULT_REDIRECT_URL);
});

export default router;
