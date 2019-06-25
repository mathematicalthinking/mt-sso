import * as express from 'express';
const router = express.Router();

import { getUser, getAuthRedirectURL } from '../middleware/user-auth';
import { getEncUrl, getVmtUrl } from '../config/app_urls';

/* GET home page. */
router.get('/', function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  let user = getUser(req);
  let vmtUrl = getVmtUrl();
  let encUrl = getEncUrl();

  if (!user) {
    res.render('index', {
      title: 'Mathematical Thinking',
    });
    return;
  }

  let redirectURL = getAuthRedirectURL(req);

  if (redirectURL) {
    res.redirect(redirectURL);
    return;
  }

  let displayName = user.firstName ? user.firstName : user.username;

  res.render('home', {
    title: 'Mathematical Thinking',
    user,
    encUrl,
    vmtUrl,
    displayName,
  });
});

export default router;
