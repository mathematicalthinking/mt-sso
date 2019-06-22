const mongoose = require('mongoose');

module.exports = () => {
  let uri = `mongodb://localhost:27017/encompass`;

  const db = mongoose.connection;

  mongoose.createConnection(uri, { useNewUrlParser: true });
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.log(`Successfully connected to ${uri}`);
  });
};
