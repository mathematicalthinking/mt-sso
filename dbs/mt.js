const mongoose = require('mongoose');

module.exports = () => {
  let env = process.env.NODE_ENV;
  let uri;
  console.log('env', env);
  if (env === 'test') {
    uri = process.env.MT_DB_URI_TEST;
  } else {
    uri = process.env.MT_DB_URI;
  }

  const db = mongoose.connection;

  mongoose.connect(uri, { useNewUrlParser: true });
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.log(`Successfully connected to ${uri}`);
  });
};
