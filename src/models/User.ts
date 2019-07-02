import { Schema, model } from 'mongoose';

import { UserDocument } from '../types';

const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String },
    encUserId: { type: ObjectId },
    vmtUserId: { type: ObjectId },
    email: {
      type: String,
      validate: {
        validator: (email: string): boolean => {
          let emailRegex = /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          return emailRegex.test(email);
        },
        // message: '{VALUE} is not a valid email address',
      },
    },
    firstName: { type: String },
    lastName: { type: String },
    googleId: { type: String },
    googleProfilePic: { type: String },
    isTrashed: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    confirmEmailToken: { type: String },
    confirmEmailExpires: { type: Date },
    isEmailConfirmed: { type: Boolean, default: false },
    doForcePasswordChange: { type: Boolean, default: false },
    lastModifiedBy: { type: ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

export default model<UserDocument>('User', UserSchema);
