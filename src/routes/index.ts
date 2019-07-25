import * as express from 'express';
const router = express.Router();

/* GET home page. */
router.get('/', function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void {
  res.redirect(process.env.DEFAULT_REDIRECT_URL);
});

export default router;
