import * as express from 'express';
const router = express.Router();

router.get(
  '/',
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    res.clearCookie('mtToken');
    res.clearCookie('redirectURL');
    res.redirect('/');
  }
);

export default router;
