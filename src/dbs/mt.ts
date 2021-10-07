import mongoose from 'mongoose';
import { version } from '../constants/version';

export default (): void => {
  let uri = process.env.MT_DB_URI;
  if (typeof uri !== 'string') {
    return;
  }
  mongoose.connect(uri, { useNewUrlParser: true });

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
      console.log(`MT-SSO version v.${version}`);
    },
  );
};
