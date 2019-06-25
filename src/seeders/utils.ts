import mongoose from 'mongoose';
export const ObjectId = mongoose.Types.ObjectId;

export const ISODate = (dateString: string): Date => {
  return new Date(dateString);
};
