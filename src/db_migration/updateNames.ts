import EncUser from '../models/EncUser';
import User from '../models/User';
import { UserDocument } from '../types';

async function updateNames(): Promise<void> {
  try {
    console.log('updating from encdb: ', process.env.ENC_DB_URI);
    console.log('updating to sso db: ', process.env.MT_DB_URI);

    let ssoUsers = await User.find({ firstName: null, lastName: null });
    console.log({ numSsoUsers: ssoUsers.length });
    let updatedUsers = ssoUsers.map(
      async (user): Promise<UserDocument | void> => {
        let encUser = await EncUser.findById(user.encUserId);
        if (encUser === null) {
          return;
        }

        console.log({ foundEncUser: encUser.firstName });
        if (typeof encUser.firstName === 'string') {
          user.firstName = encUser.firstName;
        }
        if (typeof encUser.lastName === 'string') {
          user.lastName = encUser.lastName;
        }
        return user;
        // return user.save();
      },
    );
    await Promise.all(updatedUsers);
    console.log('done!');
  } catch (err) {
    console.log('update Names err', err);
  }
}

updateNames();
