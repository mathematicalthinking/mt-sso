import { Schema, createConnection } from 'mongoose';
import { VmtUserDocument } from '../types';
const fs = require('fs');

const ObjectId = Schema.Types.ObjectId;
let uri =
  process.env.NODE_ENV === 'production'
    ? process.env.VMT_PROD_URI
    : process.env.VMT_DB_URI;

let mongoOptions = {};
if (process.env.NODE_ENV === 'production') {
  mongoOptions = {
    ssl: true,
    sslValidate: true,
    user: process.env.VMT_PROD_DB_USER,
    pass: process.env.VMT_PROD_DB_PASS,
    sslKey: fs.readFileSync(process.env.VMT_PROD_DB_SSL_KEY_DIR),
    sslCert: fs.readFileSync(process.env.VMT_PROD_DB_SSL_CERT_DIR),
    authSource: process.env.VMT_PROD_DB_AUTHDB,
    useNewUrlParser: true,
  };
} else {
  mongoOptions = {
    useNewUrlParser: true,
  };
}
const vmtDb = createConnection(uri, mongoOptions);

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
    accountType: {
      type: String,
      enum: ['participant', 'facilitator', 'temp', 'pending'],
    },
    bothRoles: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    seenTour: { type: Boolean, default: false },
    socketId: { type: String },
    token: { type: String }, // For Authentication Encompass users,
    tokenExpiryDate: { type: Date }, // // For Authentication Encompass users
    isTrashed: { type: Boolean, default: false },
    ssoId: { type: ObjectId },
    isGmail: { type: Boolean, default: false },
    sponsor: { type: ObjectId, ref: 'User' },
    metadata: { type: Object },
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
