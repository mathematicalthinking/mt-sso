import * as express from 'express';

import { getEncUrl, getVmtUrl } from '../config/app_urls';

export default (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  // Website you wish to allow to connect
  res.setHeader(
    'Access-Control-Allow-Origin',
    `${getEncUrl()}, ${getVmtUrl()}`
  );
  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type,Authorization'
  );
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  // Pass to next layer of middleware
  next();
};
