import createError from 'http-errors';
import express from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import path from 'path';

let envFileName = process.env.NODE_ENV === 'test' ? '.env_test' : '.env';

let pathToEnvFile = path.resolve(process.cwd(), envFileName);

require('dotenv').config({ path: pathToEnvFile });

import { prep, pruneRequestBody } from './middleware/prep';
import { prepareMtUser } from './middleware/user-auth';
import configureCors from './middleware/cors';
import { verifyBearerToken, verifyRequestOrigin } from './middleware/auth';

// import initializeDb from './dbs/mt';

import indexRouter from './routes/index';
import authRouter from './routes/auth';
import oauthRouter from './routes/oauth';

const configure = (app: express.Application): void => {
  app.set('views', join(__dirname, '../views'));
  app.set('view engine', 'pug');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(join(__dirname, 'public')));

  // general middleware
  app.use(configureCors);

  // prepares request with empty values
  // that will be filled in later in mw chain
  app.use(prep);

  // simply redirects to default redirect url
  app.use('/', indexRouter);

  // oauth requests
  // we are not verifying the origin/issuerid of these requests
  // oauth router uses middleware to determine if
  // redirect url in query string is valid

  app.use('/oauth', oauthRouter);

  app.use(verifyBearerToken);
  app.use(verifyRequestOrigin);
  app.use(prepareMtUser);
  app.use(pruneRequestBody);

  app.use('/auth', authRouter);

  // catch 404 and forward to error handler
  app.use(
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ): void => {
      next(createError(404, 'Route not found'));
    },
  );

  // error handler
  app.use(function(
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): void {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    console.log(
      `SSO error handler: Status: ${err.status}; Message: ${err.message}`,
    );
    let message = err.message || `Internal Server Error: ${err}`;
    res.json(message);
    // res.render('error');
  });
};

export default configure;
