import mongoose from 'mongoose';
const fs = require('fs');

export default (): void => {
  let uri =
    process.env.NODE_ENV === 'staging'
      ? process.env.MT_STAGE_URI
      : process.env.MT_DB_URI;
  if (typeof uri !== 'string') {
    return;
  }
  let mongoOptions = {};
  if (process.env.NODE_ENV === 'staging') {
    mongoOptions = {
      ssl: true,
      sslValidate: true,
      user: process.env.MT_STAGE_DB_USER,
      pass: process.env.MT_STAGE_DB_PASS,
      sslKey: fs.readFileSync(process.env.MT_STAGE_DB_SSL_KEY_DIR),
      sslCert: fs.readFileSync(process.env.MT_STAGE_DB_SSL_CERT_DIR),
      authSource: process.env.MT_STAGE_DB_AUTHDB,
      useNewUrlParser: true,
    };
  } else {
    mongoOptions = {
      useNewUrlParser: true,
    };
  }

  mongoose.connect(uri, mongoOptions);

  const db = mongoose.connection;

  db.on(
    'error',
    (err): void => {
      console.trace(err);
      throw new Error(err);
    },
  );
  db.once(
    'open',
    (): void => {
      console.log(`Successfully connected to ${uri}`);
    },
  );
};
