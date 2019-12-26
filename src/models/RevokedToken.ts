import mongoose from 'mongoose';
import { ObjectId } from 'bson';
import { RevokedTokenDocument } from '../../src/types';
import User from './User';

const Schema = mongoose.Schema;

const RevokedTokenSchema = new Schema(
  {
    encodedToken: { type: String },
    user: { type: ObjectId, ref: 'User' }, // user who this token belonged to
  },

  { timestamps: true },
);

RevokedTokenSchema.post('save', function(
  revokedToken: RevokedTokenDocument,
): void {
  if (revokedToken.user) {
    User.findByIdAndUpdate(
      revokedToken.user,
      { doRevokeRefreshToken: false },
      (err): void => {
        if (err) {
          console.log('error updating user', err);
        }
      },
    );
  }
});
export default mongoose.model('RevokedToken', RevokedTokenSchema);
