import mongoose from 'mongoose';

export default (): void => {
  let uri = process.env.MT_DB_URI;
  if (typeof uri !== 'string') {
    return;
  }
  const mongoOptions = {
    ssl: true,
    sslValidate: true,
    user: process.env.MT_DB_USER,
    pass: process.env.MT_DB_PASS,
    useNewUrlParser: true,
  };

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
