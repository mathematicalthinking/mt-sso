import { isNull, intersection } from 'lodash';

import { connect, find } from './utils';
import { UserDocument } from '../types';
import {
  FindAndModifyWriteOpResultObject,
  InsertOneWriteOpResult,
} from 'mongodb';
import { isNonEmptyString } from '../utilities/objects';

const encDbUri = 'mongodb://localhost:27017/encompass_stage';
const vmtDbUri = 'mongodb://localhost:27017/vmt_staging';
const ssoDbUri = 'mongodb://localhost:27017/mtlogin_stage';

export const addEncUsers = async function(): Promise<void> {
  let alreadyAddedUsers = 0;
  let addedVmtUsers = 0;
  let newlyAdded = 0;

  try {
    let ssoDb = await connect(ssoDbUri);
    let encDb = await connect(encDbUri);
    let encUsers = await find(encDb, 'users');

    let addedUsers = encUsers.map(
      async (
        encUser,
      ): Promise<
        FindAndModifyWriteOpResultObject | boolean | InsertOneWriteOpResult
      > => {
        let isAlreadyAdded = !isNull(
          await ssoDb.collection('users').findOne({ encUserId: encUser._id }),
        );

        if (isAlreadyAdded) {
          alreadyAddedUsers++;
          return false;
        }

        let vmtAlias = await ssoDb.collection('users').findOne({
          username: encUser.username,
          encUserId: null,
        });

        if (vmtAlias) {
          // Mt user was already created for this encompass user's vmt account
          // so just update the encUserId
          addedVmtUsers++;
          vmtAlias.encUserId = encUser._id;
          return ssoDb.collection('users').insertOne(vmtAlias);
        }
        newlyAdded++;

        let hasEmail = isNonEmptyString(encUser.email, true);

        let firstName = isNonEmptyString(encUser.firstName, true)
          ? encUser.firstName
          : undefined;

        let lastName = isNonEmptyString(encUser.lastName, true)
          ? encUser.lastName
          : undefined;

        let ssoUser = await ssoDb.collection('users').insertOne({
          username: encUser.username,
          firstName: firstName,
          lastName: lastName,
          password: encUser.password,
          encUserId: encUser._id,
          email: hasEmail ? encUser.email : undefined,
          createdAt: encUser.createDate,
          updatedAt: encUser.lastModifiedDate,
          isTrashed: encUser.isTrashed,
          confirmEmailExpires: encUser.confirmEmailExpires,
          confirmEmailToken: encUser.confirmEmailToken,
          resetPasswordToken: encUser.resetPasswordToken,
          resetPasswordExpires: encUser.resetPasswordExpires,
          isEmailConfirmed: encUser.isEmailConfirmed,
          googleId: encUser.googleId,
          doForcePasswordChange: false,
        });

        // update encompass user with new ssoId
        return encDb
          .collection('users')
          .findOneAndUpdate(
            { _id: encUser._id },
            { $set: { ssoId: ssoUser.insertedId } },
          );
      },
    );

    await Promise.all(addedUsers);
    console.log(
      `Did not create sso accounts for ${alreadyAddedUsers} enc users that were already related to an sso account.`,
    );
    console.log(
      `Updated ${addedVmtUsers} existing sso user accounts with vmt user ids`,
    );

    console.log(`Created ${newlyAdded} sso users from existing enc accounts`);
    ssoDb.close();
    encDb.close();
    // create mt user record for each user with encUserId = to the orig userid
  } catch (err) {
    throw err;
  }
};

export const findDuplicateUsers = async function(): Promise<void> {
  try {
    let ssoDb = await connect(ssoDbUri);
    let encDb = await connect(encDbUri);
    let vmtDb = await connect(vmtDbUri);

    let vmtFilter = { accountType: { $ne: 'temp' } };

    let vmtUsers = await find(vmtDb, 'users', vmtFilter);
    let encUsers = await find(encDb, 'users');

    let encUsernames = encUsers.map((user): string => user.username);

    let encEmails = encUsers
      .map((user): string | null | undefined => user.email)
      .filter(
        (email): boolean => {
          return typeof email === 'string' && email.length > 0;
        },
      );

    let vmtUsernames = vmtUsers.map((user): string => user.username);

    let vmtEmails = vmtUsers
      .map((user): string | null | undefined => user.email)
      .filter(
        (email): boolean => {
          return typeof email === 'string' && email.length > 0;
        },
      );

    console.log(
      'Usernames that are associated with both a VMT and Encompass account: ',
      intersection(encUsernames, vmtUsernames),
    );

    console.log(
      'Emails that are associated with both a VMT and Encompass account: ',
      intersection(encEmails, vmtEmails),
    );

    ssoDb.close();
    vmtDb.close();
    encDb.close();
  } catch (err) {
    console.log('err find duplicate users: ', err);
    throw err;
  }
};

export const createVmtCounterparts = async function(): Promise<void> {
  try {
    // find sso accounts that have encUserIds but no vmtUserIds
    // create default vmt accounts for them
    let filter = {
      encUserId: { $ne: null },
      vmtUserId: null,
    };

    let ssoDb = await connect(ssoDbUri);
    let vmtDb = await connect(vmtDbUri);
    let encDb = await connect(encDbUri);

    let ssoUsers = await find(ssoDb, 'users', filter);
    console.log(
      `There are ${
        ssoUsers.length
      } sso users with Encompass accounts but no VMT counterpart`,
    );

    let vmtCounterparts = ssoUsers.map(
      async (
        ssoUser: UserDocument,
      ): Promise<FindAndModifyWriteOpResultObject> => {
        let encUser = await encDb
          .collection('users')
          .findOne({ ssoId: ssoUser._id });

        let vmtUser = await vmtDb.collection('users').insertOne({
          username: ssoUser.username,
          email: ssoUser.email,
          password: ssoUser.password,
          firstName: ssoUser.firstName,
          lastName: ssoUser.lastName,
          createdAt: ssoUser.createdAt,
          updatedAt: ssoUser.updatedAt,
          isTrashed: ssoUser.isTrashed,
          isEmailConfirmed: ssoUser.isEmailConfirmed,
          doForcePasswordChange: ssoUser.doForcePasswordChange,
          confirmEmailExpires: ssoUser.confirmEmailExpires,
          confirmEmailToken: ssoUser.confirmEmailToken,
          resetPasswordToken: ssoUser.resetPasswordToken,
          resetPasswordExpires: ssoUser.resetPasswordExpires,
          googleId: ssoUser.googleId,
          ssoId: ssoUser._id,
          accountType:
            encUser.accountType === 'S' ? 'participant' : 'facilitator',
        });

        // update sso user's vmtUserId

        return ssoDb
          .collection('users')
          .findOneAndUpdate(
            { _id: ssoUser._id },
            { $set: { vmtUserId: vmtUser.insertedId } },
          );
      },
    );
    await Promise.all(vmtCounterparts);

    console.log(`Created ${vmtCounterparts.length} new vmt accounts`);
    ssoDb.close();
    vmtDb.close();
    encDb.close();
  } catch (err) {
    console.log('ERRR', err);
    throw new Error(err.message);
  }
};
