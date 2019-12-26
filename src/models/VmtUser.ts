import { Schema, createConnection } from 'mongoose';
import { VmtUserDocument } from '../types';

const ObjectId = Schema.Types.ObjectId;
const vmtDb = createConnection(process.env.VMT_DB_URI);

const VmtUser = new Schema(
  {
    courseTemplates: {
      type: [{ type: ObjectId, ref: 'CourseTemplate' }],
      default: [],
    },
    courses: { type: [{ type: ObjectId, ref: 'Course' }], default: [] },
    rooms: { type: [{ type: ObjectId, ref: 'Room' }], default: [] },
    activities: { type: [{ type: ObjectId, ref: 'Activity' }], default: [] },
    notifications: {
      type: [{ type: ObjectId, ref: 'Notification' }],
      default: [],
    },
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String, required: true },
    email: { type: String },
    accountType: { type: String, enum: ['participant', 'facilitator', 'temp'] },
    bothRoles: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    seenTour: { type: Boolean, default: false },
    socketId: { type: String },
    token: { type: String }, // For Authentication Encompass users,
    tokenExpiryDate: { type: Date }, // // For Authentication Encompass users
    isTrashed: { type: Boolean, default: false },
    ssoId: { type: ObjectId },
    ipAddresses: [{ type: String }],
    latestIpAddress: { type: String },
    isEmailConfirmed: { type: Boolean, default: false },
    doForcePasswordChange: { type: Boolean, default: false },
    confirmEmailDate: { type: Date },
    isSuspended: { type: Boolean, default: false },
    doForceLogout: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default vmtDb.model<VmtUserDocument>('User', VmtUser);
