import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const RevokedTokenSchema = new Schema(
  {
    encodedToken: { type: String },
  },

  { timestamps: true }
);

export default mongoose.model('RevokedToken', RevokedTokenSchema);
