import { connect, find } from './utils';

const encDbUri = 'mongodb://localhost:27017/encompass';
const vmtDbUri = 'mongodb://localhost:27017/vmt';
const ssoDbUri = 'mongodb://localhost:27017/mtlogin';

async function update(): Promise<void> {
  let ssoDb = await connect(ssoDbUri);
  let vmtDb = await connect(vmtDbUri);
  let encDb = await connect(encDbUri);

  try {
    let encConfirmedEmailUsers = await find(encDb, 'users', {
      isEmailConfirmed: true,
    });

    let missingUsernames: string[] = [];
    let missingVmtUsernames: string[] = [];

    await Promise.all(
      encConfirmedEmailUsers.map(
        async (encUser): Promise<void> => {
          let ssoUser = await ssoDb
            .collection('users')
            .findOne({ _id: encUser.ssoId });

          if (!ssoUser) {
            console.log('missing sso user!');
            return;
          }
          let isNotConfirmed = !ssoUser.isEmailConfirmed;

          if (isNotConfirmed) {
            console.log('ssoUser: ', ssoUser, ' missing isEmailConfirmed');
            missingUsernames.push(ssoUser.username);

            let filter = { _id: ssoUser._id };
            let update = {
              $set: { isEmailConfirmed: true, confirmEmailDate: new Date() },
            };
            await ssoDb.collection('users').findOneAndUpdate(filter, update);
          }

          let vmtUser = await vmtDb
            .collection('users')
            .findOne({ ssoId: encUser.ssoId });

          if (!vmtUser) {
            console.log('missing vmt user!');
            return;
          }
          let isVmtNotConfirmed = !vmtUser.isEmailConfirmed;

          if (isVmtNotConfirmed) {
            console.log('vmtUser: ', vmtUser, ' missing isEmailConfirmed');
            missingVmtUsernames.push(vmtUser.username);

            let filter = { _id: vmtUser._id };
            let update = {
              $set: { isEmailConfirmed: true, confirmEmailDate: new Date() },
            };
            await vmtDb.collection('users').findOneAndUpdate(filter, update);
          }
        },
      ),
    );

    console.log(`Sso users missing email confirmation: ${missingUsernames}`);
    console.log(`Vmt users missing email confirmation: ${missingVmtUsernames}`);

    ssoDb.close();
    encDb.close();
    vmtDb.close();
  } catch (err) {
    console.log(err);
    ssoDb.close();
    encDb.close();
    vmtDb.close();
  }
}

update();
