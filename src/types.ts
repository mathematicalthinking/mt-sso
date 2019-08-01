/* eslint-disable @typescript-eslint/no-namespace */
import mongoose from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      mt: {
        auth: {
          bearerToken: string;
          user?: UserDocument;
          allowedIssuers?: string[];
          signup: {
            user?: UserDocument;
          };
          issuer: {
            id?: string;
            name?: string;
            host?: string;
          };
          ssoId: string;
        };
        oauth: {
          successRedirectUrl: string;
          failureRedirectUrl: string;
        };
      };
    }
  }
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'staging' | 'test';
      DEFAULT_REDIRECT_URL: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      GOOGLE_CALLBACK_URL: string;
      PORT: string;
      MT_USER_JWT_SECRET: string;
      MT_DB_URI: string;
      JWT_ISSUER_ID: string;
      ENC_URL: string;
      ENC_PATH_TO_MODELS: string;
      ENC_GMAIL_USERNAME: string;
      ENC_GMAIL_PASSWORD: string;
      ENC_JWT_ISSUER_ID: string;
      ENC_OAUTH_FAILURE_REDIRECT_PATH: string;
      VMT_URL: string;
      VMT_PATH_TO_MODELS: string;
      VMT_GMAIL_USERNAME: string;
      VMT_GMAIL_PASSWORD: string;
      VMT_JWT_ISSUER_ID: string;
      VMT_OAUTH_FAILURE_REDIRECT_PATH: string;
      SSO_COOKIE_DOMAIN: string;
      VMT_OAUTH_SUCCESS_REDIRECT_PATH: string;
      ENC_DB_URI: string;
      VMT_DB_URI: string;
    }
  }
}

export type MongooseOId = mongoose.Schema.Types.ObjectId;
export interface VerifiedMtTokenPayload {
  ssoId: MongooseOId;
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
  email?: string | null;
  firstName: string;
  lastName: string;
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
  [field: string]:
    | string
    | MongooseOId
    | undefined
    | number
    | Date
    | boolean
    | null;
};

export type EmailTemplateGenerator = (
  recipient: string,
  host: string,
  token: string | null,
  user: UserDocument,
  sender: string,
  appName: string,
) => EmailTemplateHash;

export type EncUserDocument = mongoose.Document & {
  _id: MongooseOId;
  firstName?: string;
  lastName?: string;
  username: string;
  email?: string;
  ssoId?: MongooseOId;
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
};

export interface VmtUserDocument {
  _id: MongooseOId;
  firstName?: string;
  lastName?: string;
  username: string;
  email?: string;
  ssoId?: MongooseOId;
  accountType: string;
  createdAt: Date;
  updatedAt: Date;
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

export enum VmtAccountType {
  participant = 'particpant',
  facilitator = 'facilitator',
}

export enum EncAccountType {
  S = 'S',
  T = 'T',
  P = 'P',
  A = 'A',
}

export type EncUserModel = mongoose.Model<EncUserDocument>;

export interface LocalSignupRequest {
  firstName: string;
  lastName: string;
  password: string;
  email?: string;
  username: string;
}

export interface LoginResponse {
  user: UserDocument | null;
  message: string | null;
  accessToken?: string;
  refreshToken?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupResponse {
  message?: string;
  existingUser?: UserDocument;
  encUser?: EncUserDocument;
  vmtUser?: VmtUserDocument;
  accessToken?: string;
  refreshToken?: string;
}

export interface ValidationErrorResponse {
  message: string;
  field?: string;
  value?: unknown;
}

export interface EncSignUpRequest {
  firstName?: string;
  lastName?: string;
  location: string;
  username: string;
  password: string;
  email?: string;
  organization?: string;
  organizationRequest?: string;
  requestReason?: string;
  accountType: string;
  isAuthorized?: boolean;
  createdBy?: string;
}
export interface VmtSignUpRequest {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  accountType: string;
}

export interface GoogleSignupResponse {
  mtUser: UserDocument | null;
  message: string | null;
}

export type RevokedTokenDocument = mongoose.Document & {
  encodedToken: string;
};

export interface VerifiedApiToken {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  ssoId: string;
}
