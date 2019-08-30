import { connect, find } from './utils';
import { FindAndModifyWriteOpResultObject } from 'mongodb';

const encDbUri = 'mongodb://localhost:27017/encompass';
const vmtDbUri = 'mongodb://localhost:27017/vmt';
const ssoDbUri = 'mongodb://localhost:27017/mtlogin';

const updateUsers = async function(): Promise<void> {
  try {
    let ssoDb = await connect(ssoDbUri);
    let vmtDb = await connect(vmtDbUri);
    let encDb = await connect(encDbUri);

    let vmtFilter = {
      username: /[A-Z]/,
      accountType: { $ne: 'temp' },
    };

    let vmtCapitalUsers = await find(vmtDb, 'users', vmtFilter);

    console.log(
      `There are ${
        vmtCapitalUsers.length
      } non temp users with a capital letter in username`,
    );

    let updatedVmtCapitalUsers = await Promise.all(
      vmtCapitalUsers.map(
        async (user): Promise<FindAndModifyWriteOpResultObject | null> => {
          let duplicate = await vmtDb.collection('users').findOne({
            username: user.username.toLowerCase(),
          });

          if (duplicate) {
            console.log(
              `CONFLICT for vmt user with username: ${user.username}`,
            );
            return null;
          }
          return vmtDb
            .collection('users')
            .findOneAndUpdate(
              { _id: user._id },
              { $set: { username: user.username.toLowerCase() } },
            );
        },
      ),
    );

    let encFilter = {
      username: /[A-Z]/,
    };

    let encCapitalUsers = await find(encDb, 'users', encFilter);

    console.log(
      `There are ${
        encCapitalUsers.length
      } encompass users with a capital letter in username`,
    );

    let updatedEncCapitalUsers = await Promise.all(
      encCapitalUsers.map(
        async (user): Promise<FindAndModifyWriteOpResultObject | null> => {
          let duplicate = await encDb.collection('users').findOne({
            username: user.username.toLowerCase(),
          });

          if (duplicate) {
            console.log(
              `CONFLICT for enc user with username: ${user.username}`,
            );
            return null;
          }
          return encDb
            .collection('users')
            .findOneAndUpdate(
              { _id: user._id },
              { $set: { username: user.username.toLowerCase() } },
            );
        },
      ),
    );

    let ssoFilter = {
      username: /[A-Z]/,
    };

    let ssoCapitalUsers = await find(ssoDb, 'users', ssoFilter);

    console.log(
      `There are ${
        ssoCapitalUsers.length
      } sso users with a capital letter in username`,
    );

    let updatedSsoCapitalUsers = await Promise.all(
      ssoCapitalUsers.map(
        async (user): Promise<FindAndModifyWriteOpResultObject | null> => {
          let duplicate = await ssoDb.collection('users').findOne({
            username: user.username.toLowerCase(),
          });

          if (duplicate) {
            console.log(
              `CONFLICT for sso user with username: ${user.username}`,
            );
            return null;
          }
          return ssoDb
            .collection('users')
            .findOneAndUpdate(
              { _id: user._id },
              { $set: { username: user.username.toLowerCase() } },
            );
        },
      ),
    );

    ssoDb.close();
    encDb.close();
    vmtDb.close();
  } catch (err) {
    console.log(err);
  }
};

updateUsers();
