const mongoose = require('mongoose');
const _ = require('lodash');

const mtUser = require('../models/User');
const { connect, find } = require('./utils');

const getEncUsers = async () => {
  try {
    const db = await connect('mongodb://localhost:27017/encompass');

    return find(db, 'users');
  } catch (err) {
    console.error(`Error addEncUsers: ${err}`);
    mongoose.connection.close();
  }
};

async function addEncUsers() {
  let alreadyAddedUsers = 0;
  let addedVmtUsers = 0;
  let newlyAdded = 0;

  try {
    let encUsers = await getEncUsers();

    await connect('mongodb://localhost:27017/mtlogin');

    let addedUsers = encUsers.map(async encUser => {
      let isAlreadyAdded = !_.isNull(
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
    console.error(`Error addEncUsers: ${err}`);
  }
}

addEncUsers();
