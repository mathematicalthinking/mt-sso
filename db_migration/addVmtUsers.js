const mongoose = require('mongoose');
const _ = require('lodash');

const mtUser = require('../models/User');
const { connect, find } = require('./utils');

const getvmtUsers = async () => {
  try {
    const db = await connect('mongodb://localhost:27017/vmt-test');

    return find(db, 'users');
  } catch (err) {
    console.error(`Error addVmtUsers: ${err}`);
    mongoose.connection.close();
  }
};

async function addVmtUsers() {
  let alreadyAddedUsers = 0;
  let addedEncUsers = 0;
  let newlyAdded = 0;

  try {
    let vmtUsers = await getvmtUsers();

    // close connection to vmt
    mongoose.connection.close();

    await connect('mongodb://localhost:27017/mtlogin_test');

    let addedUsers = vmtUsers.map(async vmtUser => {
      let isAlreadyAdded = !_.isNull(
        await mtUser.findOne({ vmtUserId: vmtUser._id })
      );

      if (isAlreadyAdded) {
        alreadyAddedUsers++;
        return false;
      }

      let encAlias = await mtUser.findOne({
        username: vmtUser.username,
        vmtUserId: null,
      });

      if (encAlias) {
        // Mt user was already created for this vmt user's enc account
        // so just update the vmtUserId
        addedEncUsers++;
        encAlias.vmtUserId = vmtUser._id;
        return encAlias.save();
      }
      newlyAdded++;

      return mtUser.create({
        username: vmtUser.username,
        password: vmtUser.password,
        vmtUserId: vmtUser._id,
        email: vmtUser.email,
        createdAt: vmtUser.createdAt,
        updatedAt: vmtUser.updatedAt,
        isTrashed: vmtUser.isTrashed,
        isEmailConfirmed: true,
      });
    });

    await Promise.all(addedUsers);
    console.log(
      `Did not add ${alreadyAddedUsers} users that were already added.`
    );
    console.log(`Updated ${addedEncUsers} existing mt users with enc user ids`);

    console.log(`Added ${newlyAdded} new users`);
    mongoose.connection.close();
    // create mt user record for each user with vmtUserId = to the orig userid
  } catch (err) {
    console.error(`Error addVmtUsers: ${err}`);
  }
}

addVmtUsers();
