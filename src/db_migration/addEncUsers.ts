import * as mongoose from 'mongoose';
import { isNull, compact } from 'lodash';

import mtUser from '../models/User';
import { connect, find } from './utils';

const getEncUsers = async (filter = {}): Promise<any[]> => {
  try {
    const db = await connect('mongodb://localhost:27017/encompass_seed');

    return find(db, 'users', filter);
  } catch (err) {
    mongoose.connection.close();
    throw err;
  }
};

async function addEncUsers(): Promise<void> {
  let alreadyAddedUsers = 0;
  let addedVmtUsers = 0;
  let newlyAdded = 0;

  try {
    let encUsers = await getEncUsers();

    await connect('mongodb://localhost:27017/mtlogin_test');

    let addedUsers = encUsers.map(async encUser => {
      let isAlreadyAdded = !isNull(
        await mtUser.findOne({ encUserId: encUser._id })
      );

      if (isAlreadyAdded) {
        alreadyAddedUsers++;
        return false;
      }

      let vmtAlias = await mtUser.findOne({
        username: encUser.username,
        encUserId: null,
      });

      if (vmtAlias) {
        // Mt user was already created for this encompass user's vmt account
        // so just update the encUserId
        addedVmtUsers++;
        vmtAlias.encUserId = encUser._id;
        return vmtAlias.save();
      }
      newlyAdded++;
      return mtUser.create({
        username: encUser.username,
        password: encUser.password,
        encUserId: encUser._id,
        email: encUser.email,
        createdAt: encUser.createDate,
        updatedAt: encUser.lastModifiedDate,
        isTrashed: encUser.isTrashed,
        confirmEmailExpires: encUser.confirmEmailExpires,
        confirmEmailToken: encUser.confirmEmailToken,
        resetPasswordToken: encUser.resetPasswordToken,
        resetPasswordExpires: encUser.resetPasswordExpires,
        isEmailConfirmed: encUser.isEmailConfirmed,
        googleId: encUser.googleId,
      });
    });

    await Promise.all(addedUsers);
    console.log(
      `Did not add ${alreadyAddedUsers} users that were already added.`
    );
    console.log(`Updated ${addedVmtUsers} existing mt users with enc user ids`);

    console.log(`Added ${newlyAdded} new users`);
    mongoose.connection.close();
    // create mt user record for each user with encUserId = to the orig userid
  } catch (err) {
    throw err;
  }
}

const getVmtUsers = async (filter = {}): Promise<any[]> => {
  try {
    const db = await connect('mongodb://localhost:27017/vmt-test');

    return find(db, 'users', filter);
  } catch (err) {
    console.error(`Error addVmtUsers: ${err}`);
    mongoose.connection.close();
    throw err;
  }
};

async function findDuplicateUsers(): Promise<void> {
  try {
    let vmtUsers = await getVmtUsers({ accountType: { $ne: 'temp' } });

    let vmtUsernames = vmtUsers.map(user => user.username);
    let vmtEmails = vmtUsers.map(user => user.email);

    let duplicates = await getEncUsers({ username: { $in: vmtUsernames } });

    let duplicatesByEmauls = await getEncUsers({ email: { $in: vmtEmails } });

    console.log('usernames', duplicates.map(u => u.username));

    console.log('dupes by emails', duplicatesByEmauls.map(u => u.email));

    let encUsers = await getEncUsers();

    let encUserNames = compact(encUsers.map(u => u.name));

    let oneName = encUserNames.filter(n => {
      let split = n.split(' ');
      return split.length === 1;
    });
    console.log('oneNames', oneName);
  } catch (err) {
    console.log('err find duplicate users: ', err);
    throw err;
  }
}

addEncUsers();
// findDuplicateUsers();
