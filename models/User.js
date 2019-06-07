const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/**
 * @public
 * @class User
 * @class User
 * @description A user is created by signup using passport and authorized by admin
 * @todo We need to decide how to handle different user types/roles
 */
const UserSchema = new Schema(
  {
    username: { type: String, trim: true },
    password: { type: String },
    mtToken: { type: String },
    mtTokenExpiryDate: { type: Date },
    encUserId: { type: ObjectId },
    vmtUserId: { type: ObjectId },
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    googleId: { type: String },
    googleProfilePic: { type: String },
    isTrashed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
