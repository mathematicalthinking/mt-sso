import * as express from 'express';

import { getAuthRedirectURL } from '../../middleware/user-auth';

import allowedDomains from '../../constants/allowed_domains';

import { jwtLogin } from '../../controllers/localLogin';

const router: express.Router = express.Router();

router.get(
  '/',
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    let redirectURL = getAuthRedirectURL(req);

    let explanation;

    // if (redirectURL) {
    //   let redirectApp = allowedDomains[redirectURL];
    //   explanation = `You will be redirected back to ${redirectApp} after logging in.`;
    // }

    let authRedirectURL = allowedDomains.includes(redirectURL)
      ? redirectURL
      : '/';

    explanation = `You will be redirected after logging in.`;

    res.render('login', {
      title: 'Log In to Your Mathematical Thinking Account',
      explanation,
    });
  }
);

router.post('/', jwtLogin);

export default router;
