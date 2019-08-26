import Joi from '@hapi/joi';
import { EncAccountType, VmtAccountType } from '../types';

const disallowedUsernames = ['admin', 'encompass', 'vmt', 'virtualmathteams'];
const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const usernamePattern = /^[a-z0-9_]{3,30}$/;

const trimmed = Joi.string().trim();

export const signupUsername = trimmed
  .required()
  .min(3)
  .max(30)
  .lowercase()
  .regex(usernamePattern)
  .invalid(disallowedUsernames);

export const signupPassword = trimmed
  .required()
  .min(10)
  .max(72);

export const email = trimmed.regex(emailPattern);
export const encEmail = Joi.when('accountType', {
  is: EncAccountType.S,
  then: email,
  otherwise: email.required(),
});

export const firstName = trimmed.max(100);
export const encFirstName = Joi.when('accountType', {
  is: EncAccountType.S,
  then: firstName,
  otherwise: firstName.required(),
});

export const lastName = trimmed.max(200);
export const encLastName = Joi.when('accountType', {
  is: EncAccountType.S,
  then: lastName,
  otherwise: lastName.required(),
});

export const vmtFirstName = Joi.when('accountType', {
  is: VmtAccountType.participant,
  then: firstName,
  otherwise: firstName.required(),
});

export const vmtLastName = Joi.when('accountType', {
  is: VmtAccountType.participant,
  then: lastName,
  otherwise: lastName.required(),
});

export const location = trimmed.max(50);

const encLocation = Joi.when('accountType', {
  is: EncAccountType.S,
  then: location,
  otherwise: location.required(),
});

export const ObjectIdHexString = trimmed.regex(/^[0-9a-fA-F]{24}$/);

export const encSignupRequest = Joi.object()
  .keys({
    firstName: encFirstName,
    lastName: encLastName,
    location: encLocation,
    username: signupUsername,
    password: signupPassword,
    email: encEmail,
    requestReason: trimmed.max(250),
    accountType: trimmed
      .required()
      .uppercase()
      .valid(Object.keys(EncAccountType)),
    organization: ObjectIdHexString,
    organizationRequest: trimmed.max(100),
    createdBy: ObjectIdHexString,
    isAuthorized: Joi.boolean(),
    authorizedBy: Joi.when('isAuthorized', {
      is: true,
      then: ObjectIdHexString.required(),
      otherwise: ObjectIdHexString,
    }),
    sections: Joi.array(),
  })
  .xor('organization', 'organizationRequest')
  .without('requestReason', 'createdBy')
  .without('createdBy', 'requestReason');
// requestReason if from signup form;
// createdBy if created by existing user from app

export const vmtSignupRequest = Joi.object().keys({
  firstName: vmtFirstName,
  lastName: vmtLastName,
  username: signupUsername,
  password: signupPassword,
  email: email.required(),
  accountType: Joi.string()
    .required()
    .trim()
    .lowercase()
    .valid(Object.keys(VmtAccountType)),
  rooms: Joi.array(),
  _id: ObjectIdHexString,
});

export const loginRequest = Joi.object().keys({
  username: trimmed
    .required()
    .lowercase()
    .max(256),
  password: trimmed.required().max(256),
});

export const forgotPasswordRequest = Joi.object()
  .keys({
    username: trimmed.lowercase().max(256),
    email,
  })
  .xor('username', 'email');

export const basicTokenRequest = Joi.object().keys({
  token: trimmed.required(),
});

export const resetPasswordByTokenRequest = Joi.object().keys({
  password: signupPassword,
});

export const resetPasswordByIdRequest = Joi.object().keys({
  ssoId: ObjectIdHexString.required(),
  password: signupPassword,
});
