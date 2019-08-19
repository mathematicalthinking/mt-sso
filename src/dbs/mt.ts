import mongoose from 'mongoose';

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
    },
  );
};
