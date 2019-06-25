/* eslint-disable @typescript-eslint/no-namespace */
import * as mongoose from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      mt: {
        auth: {
          redirectURL?: string;
          user?: UserDocument;
        };
      };
    }
  }
}

export type MongooseOId = mongoose.Types.ObjectId;

export interface VerifiedMtTokenPayload {
  mtUserId: MongooseOId;
  encUserId: MongooseOId;
  vmtUserId: MongooseOId;
}

export interface EmailTemplateHash {
  to: string;
  from: string;
  subject: string;
  text: string;
}

export type UserDocument = mongoose.Document & {
  username: string;
  password: string;
  encUserId?: MongooseOId;
  vmtUserId?: MongooseOId;
  email?: string;
  firstName?: string;
  lastName?: string;
  googleId?: string;
  googleProfilePic: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date | number;
  confirmEmailToken?: string;
  confirmEmailExpires?: Date | number;
  isEmailConfirmed: boolean;
  doForcePasswordChange: boolean;
  lastModifiedBy: MongooseOId;
  updatedAt: Date;
  createdAt: Date;
  isTrashed: boolean;
};

export type EmailTemplateGenerator = (
  recipient: string,
  host: string,
  token: string | null,
  user: UserDocument,
  sender: string,
  appName: string
) => EmailTemplateHash;

export interface EncUserDocument {
  _id: MongooseOId;
  firstName?: string;
  lastName?: string;
  username: string;
  email?: string;
  mtUserId?: MongooseOId;
  organization?: MongooseOId;
  organizationRequest?: string;
  location?: string;
  isAuthorized: boolean;
  requestReason?: string;
  accountType: string;
  createdBy: MongooseOId;
  authorizedBy?: MongooseOId;
  isEmailConfirmed: boolean;
  actingRole: string;
  createDate: Date;
  lastModifiedDate: Date;
}

export interface EncSignUpDetails {
  firstName?: string;
  lastName?: string;
  username: string;
  email?: string;
  mtUserId?: MongooseOId;
  organization?: MongooseOId;
  organizationRequest?: string;
  location?: string;
  isAuthorized: boolean;
  requestReason?: string;
  accountType: string;
  createdBy: MongooseOId;
  authorizedBy?: MongooseOId;
  isEmailConfirmed: boolean;
  actingRole: string;
  createDate: Date;
  lastModifiedDate: Date;
}

export interface VmtUserDocument {
  _id: MongooseOId;
  firstName?: string;
  lastName?: string;
  username: string;
  email?: string;
  mtUserId?: MongooseOId;
  accountType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VmtSignupDetails {
  firstName?: string;
  lastName?: string;
  username: string;
  email?: string;
  mtUserId?: MongooseOId;
  accountType: string;
}

export interface SignUpDetails {
  firstName?: string;
  lastName?: string;
  password: string;
  email?: string;
  username: string;
}

export interface GoogleOauthTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: string;
  token_type: string;
}

export interface GoogleOauthProfileResponse {
  sub: string;
  given_name: string;
  family_name: string;
  picture?: string;
  email: string;
}
