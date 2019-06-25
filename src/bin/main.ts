/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import initializeDb from '../dbs/mt';

import configure from '../index';

const app = express();

configure(app);

let port: number | string | undefined;

if (process.env.NODE_ENV === 'test') {
  port = process.env.TEST_PORT;
} else {
  port = process.env.PORT || 3002;
}
app.listen(
  port,
  (): void => {
    console.log(`Application is listening on port ${port}.`);
    initializeDb();
  }
);
