const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RevokedTokenSchema = new Schema(
  {
    encodedToken: { type: String },
  },

  { timestamps: true }
);

module.exports = mongoose.model('RevokedToken', RevokedTokenSchema);
