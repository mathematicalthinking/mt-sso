import { Schema, createConnection } from 'mongoose';
import { EncUserDocument } from '../types';
const fs = require('fs');

const ObjectId = Schema.Types.ObjectId;
let uri =
  process.env.NODE_ENV === 'production'
    ? process.env.ENC_PROD_URI
    : process.env.ENC_DB_URI;

let mongoOptions = {};
if (process.env.NODE_ENV === 'production') {
  mongoOptions = {
    ssl: true,
    sslValidate: true,
    user: process.env.ENC_PROD_DB_USER,
    pass: process.env.ENC_PROD_DB_PASS,
    sslKey: fs.readFileSync(process.env.ENC_PROD_DB_SSL_KEY_DIR),
    sslCert: fs.readFileSync(process.env.ENC_PROD_DB_SSL_CERT_DIR),
    authSource: process.env.ENC_PROD_DB_AUTHDB,
    useNewUrlParser: true,
  };
} else {
  mongoOptions = {
    useNewUrlParser: true,
  };
}
const encDb = createConnection(uri, mongoOptions);
/**
 * @public
 * @class Log
 * @description A single user history log of an event.
 *              Used as a subdocument of the user model
 */
var Log = new Schema(
  {
    creator: { type: String, default: 'system' },
    time: { type: Date, default: Date.now() },
    event: { type: String, required: true },
    duration: { type: Number, default: 0 },
    isError: { type: Boolean, default: false },
  },
  {
    versionKey: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

const EncUserSchema = new Schema(
  {
    //== Shared properties (Because Monggose doesn't support schema inheritance)
    createdBy: { type: ObjectId, ref: 'User' },
    createDate: { type: Date, default: Date.now() },
    isTrashed: { type: Boolean, default: false },
    lastModifiedBy: { type: ObjectId, ref: 'User' },
    lastModifiedDate: { type: Date, default: Date.now() },
    //====
    /* + The username is the mfapps username */
    username: { type: String, unique: true, required: true },
    accountType: { type: String, enum: ['A', 'P', 'T', 'S'], required: true },
    isAdmin: Boolean, // depricated - needed to convert to new accountType field
    /* + Are they otherwise authorized for EnCoMPASS */
    isAuthorized: { type: Boolean, default: false },
    authorizedBy: { type: ObjectId, ref: 'User' },

    // 'student' or 'teacher' - only used by teacher accounts to determine if they are in teacher mode or student mode
    actingRole: { type: String, enum: ['teacher', 'student'] },
    name: { type: String },
    email: { type: String },
    avatar: { type: String },
    googleId: { type: String },
    isEmailConfirmed: { type: Boolean, default: false },
    organization: { type: ObjectId, ref: 'Organization' },
    organizationRequest: { type: String },
    location: { type: String },
    requestReason: { type: String },
    // We only use google for external auth, we can use these fields if we use more OAuths
    // authSource: String,
    // authUserId: String,
    sections: [
      {
        sectionId: { type: ObjectId, ref: 'Section' },
        role: String,
        _id: false,
      },
    ],
    answers: [{ type: ObjectId, ref: 'Answer' }],
    // Migrating from assignments to answers, keeping this in for tests - change apiTest for assinment to answer
    assignments: [{ type: ObjectId, ref: 'Assignment' }],

    // workspaces where user has been added as a collaborator
    // only used for non-admins because admins can access any workspace by default
    collabWorkspaces: [{ type: ObjectId, ref: 'Workspace' }],
    hiddenWorkspaces: [{ type: ObjectId, ref: 'Workspace' }],
    notifications: [{ type: ObjectId, ref: 'Notification' }],
    socketId: { type: String },
    seenTour: { type: Date },
    lastSeen: { type: Date },
    firstName: { type: String },
    lastName: { type: String },
    history: [Log], // currently not working,
    ssoId: { type: ObjectId },
    doForcePasswordChange: { type: Boolean, default: false },
    confirmEmailDate: { type: Date },
  },
  {
    versionKey: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

export default encDb.model<EncUserDocument>('User', EncUserSchema);
