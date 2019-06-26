/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import initializeDb from '../dbs/mt';

import configure from '../index';

const app = express();

configure(app);

let port = process.env.PORT || 3002;

app.listen(
  port,
  (): void => {
    console.log(`Application is listening on port ${port}.`);
    initializeDb();
  }
);
