const mongoose = require('mongoose');

module.exports.connect = function connectToDb(url) {
  return new Promise((resolve, reject) => {
    mongoose.connect(url);

    const db = mongoose.connection;

    db.on('error', function(err) {
      reject(err);
    });

    db.on('connected', () => {
      console.log(`connected to ${url}`);
      resolve(db);
    });
  });
};

module.exports.find = function(db, collection, filter = {}) {
  return new Promise((resolve, reject) => {
    db.collection(collection)
      .find(filter)
      .toArray(function(err, results) {
        if (err) {
          mongoose.connection.close();
          reject(err);
        }
        mongoose.connection.close();
        resolve(results);
      });
  });
};
