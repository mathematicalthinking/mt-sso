import { connect, find, findOne } from './utils';
import { UserDocument } from '../types';
import { FindAndModifyWriteOpResultObject } from 'mongodb';
import { isNonEmptyString } from '../utilities/objects';

const encDbUri = 'mongodb://localhost:27017/encompass';
const vmtDbUri = 'mongodb://localhost:27017/vmt';
const ssoDbUri = 'mongodb://localhost:27017/mtlogin';

export const addVmtUsers = async function(): Promise<void> {
  let alreadyAddedUsers = 0;
  let addedEncUsers = 0;
  let newlyAdded = 0;

  try {
    let ssoDb = await connect(ssoDbUri);
    let vmtDb = await connect(vmtDbUri);

    let vmtUsers = await find(vmtDb, 'users', { accountType: { $ne: 'temp' } });

    let addedUsers = vmtUsers.map(
      async (
        vmtUser,
      ): Promise<
        | FindAndModifyWriteOpResultObject
        | boolean
        | FindAndModifyWriteOpResultObject[]
      > => {
        let existingUser = await findOne(ssoDb, 'users', {
          vmtUserId: vmtUser._id,
        });

        let isAlreadyAdded = existingUser !== null;
        if (isAlreadyAdded) {
          console.log('existing user: ', existingUser);
          // need to update the vmt user with ssoId, isEmailConfirmed, etc
          alreadyAddedUsers++;
          return false;
        }

        let encAlias = await ssoDb.collection('users').findOne({
          username: vmtUser.username,
          vmtUserId: null,
        });

        if (encAlias) {
          // Mt user was already created for this vmt user's enc account
          // so just update the vmtUserId
          // encAlias is sso user
          console.log('encAlias', encAlias);
          addedEncUsers++;
          encAlias.vmtUserId = vmtUser._id;

          let ssoDbUpdate = ssoDb
            .collection('users')
            .findOneAndUpdate(
              { _id: encAlias._id },
              { $set: { vmtUserId: vmtUser._id } },
            );
          let vmtDbUpdate = vmtDb.collection('users').findOneAndUpdate(
            { _id: vmtUser._id },
            {
              $set: {
                ssoId: encAlias._id,
                isEmailConfirmed: encAlias.isEmailConfirmed,
                doForcePasswordChange: encAlias.doForcePasswordChange,
              },
            },
          );

          return Promise.all([ssoDbUpdate, vmtDbUpdate]);
        }
        newlyAdded++;

        let hasEmail = isNonEmptyString(vmtUser.email, true);

        // let hasPassword = isNonEmptyString(vmtUser.password, true);

        let firstName = isNonEmptyString(vmtUser.firstName, true)
          ? vmtUser.firstName
          : undefined;

        let lastName = isNonEmptyString(vmtUser.lastName, true)
          ? vmtUser.lastName
          : undefined;

        let ssoUser = await ssoDb.collection('users').insertOne({
          username: vmtUser.username,
          password: vmtUser.password,
          firstName: firstName,
          lastName: lastName,
          vmtUserId: vmtUser._id,
          email: hasEmail ? vmtUser.email : undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
          isTrashed: vmtUser.isTrashed,
          isEmailConfirmed: hasEmail ? true : false,
          doForcePasswordChange: false,
          confirmEmailExpires: vmtUser.confirmEmailExpires,
          confirmEmailToken: vmtUser.confirmEmailToken,
          resetPasswordToken: vmtUser.resetPasswordToken,
          resetPasswordExpires: vmtUser.resetPasswordExpires,
          googleId: vmtUser.googleId,
          confirmEmailDate: vmtUser.confirmEmailDate,
        });

        // update vmt user with new ssoId
        return vmtDb.collection('users').findOneAndUpdate(
          { _id: vmtUser._id },
          {
            $set: {
              ssoId: ssoUser.insertedId,
              isEmailConfirmed: hasEmail ? true : false,
              doForcePasswordChange: false,
            },
          },
        );
      },
    );

    await Promise.all(addedUsers);
    console.log(
      `Did not create sso accounts for ${alreadyAddedUsers} vmt users that were already related to an sso account.`,
    );
    console.log(
      `Updated ${addedEncUsers} existing sso user accounts with enc user ids`,
    );

    console.log(`Created ${newlyAdded} sso users from existing vmt accounts`);
    ssoDb.close();
    // create mt user record for each user with vmtUserId = to the orig userid
  } catch (err) {
    console.error(`Error addVmtUsers: ${err}`);
    throw err;
  }
};

export const createEncCounterparts = async function(): Promise<void> {
  try {
    // find sso accounts that have vmtUserIds but no encUserIds
    // create default enc accounts for them
    let filter = {
      vmtUserId: { $ne: null },
      encUserId: null,
    };

    let ssoDb = await connect(ssoDbUri);
    let vmtDb = await connect(vmtDbUri);
    let encDb = await connect(encDbUri);

    let ssoUsers = await find(ssoDb, 'users', filter);
    console.log(
      `There are ${
        ssoUsers.length
      } sso users with VMT accounts but no Encompass counterpart`,
    );
    let encCounterparts = ssoUsers.map(
      async (
        ssoUser: UserDocument,
      ): Promise<FindAndModifyWriteOpResultObject> => {
        let vmtUser = await vmtDb
          .collection('users')
          .findOne({ ssoId: ssoUser._id });

        let encUser = await encDb.collection('users').insertOne({
          username: ssoUser.username,
          firstName: ssoUser.firstName,
          lastName: ssoUser.lastName,
          email: ssoUser.email,
          createDate: new Date(),
          lastModifiedDate: new Date(),
          isTrashed: ssoUser.isTrashed,
          isEmailConfirmed: ssoUser.isEmailConfirmed,
          doForcePasswordChange: ssoUser.doForcePasswordChange,
          googleId: ssoUser.googleId,
          ssoId: ssoUser._id,
          accountType: vmtUser.accountType === 'participant' ? 'S' : 'T',
          sections: [],
          answers: [],
          assignments: [],
          collabWorkspaces: [],
          hiddenWorkspaces: [],
          notifications: [],
          history: [],
          isAuthorized: true,
          confirmEmailDate: ssoUser.confirmEmailDate,
          actingRole:
            vmtUser.accountType === 'participant' ? 'student' : 'teacher',
        });

        // update sso user's encUserId

        return ssoDb
          .collection('users')
          .findOneAndUpdate(
            { _id: ssoUser._id },
            { $set: { encUserId: encUser.insertedId } },
          );
      },
    );
    await Promise.all(encCounterparts);
    console.log(`Created ${encCounterparts.length} new Encompass accounts`);

    ssoDb.close();
    vmtDb.close();
    encDb.close();
  } catch (err) {
    console.log('ERRR', err);
    throw new Error(err.message);
  }
};

// addVmtUsers();
