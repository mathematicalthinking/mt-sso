const crypto = require('crypto');

module.exports.getResetToken = function(size) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(size, (err, buf) => {
      if (err) {
        return reject(err);
      }
      const token = buf.toString('hex');
      return resolve(token);
    });
  });
};
