import * as express from 'express';
const router = express.Router();

import localSignup from '../../controllers/localSignup';

router.get(
  '/',
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    res.render('signup', {
      title: 'Sign Up for a Mathematical Thinking Account',
      explanation:
        'Both EnCOMPASS and VMT accounts will be automatically created for you',
    });
  }
);

router.post('/', localSignup);

export default router;
