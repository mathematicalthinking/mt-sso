import * as express from 'express';
const router = express.Router();

import { getAuthRedirectURL } from '../middleware/user-auth';

/* GET home page. */
router.get('/', function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  let redirectURL = getAuthRedirectURL(req);

  if (redirectURL) {
    res.redirect(redirectURL);
    return;
  }

  res.redirect(process.env.DEFAULT_REDIRECT_URL);
});

export default router;
