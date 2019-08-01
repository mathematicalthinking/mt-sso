import {
  EncUserUpdateDetails,
  VmtUserUpdateDetails,
  EncVmtUserUpdateResults,
} from './types';
import { connect } from '../../db_migration/utils';
import { propertyOf } from 'lodash';

export const updateEncVmtUsers = async (
  encDetails: EncUserUpdateDetails,
  vmtDetails: VmtUserUpdateDetails,
): Promise<EncVmtUserUpdateResults> => {
  let encDb;
  let vmtDb;

  let results: EncVmtUserUpdateResults = { wasSuccess: false };

  try {
    [encDb, vmtDb] = await Promise.all([
      connect(process.env.ENC_DB_URI),
      connect(process.env.VMT_DB_URI),
    ]);

    let [encResults, vmtResults] = await Promise.all([
      encDb
        .collection('users')
        .findOneAndUpdate(encDetails.filter, encDetails.update, {
          returnOriginal: false,
        }),
      vmtDb
        .collection('users')
        .findOneAndUpdate(vmtDetails.filter, vmtDetails.update, {
          returnOriginal: false,
        }),
    ]);

    let didUpdateEnc =
      propertyOf(encResults)('lastErrorObject.updatedExisting') === true;
    let didUpdateVmt =
      propertyOf(vmtResults)('lastErrorObject.updatedExisting') === true;

    console.log('enc results: ', encResults);
    console.log('vmt results', vmtResults);
    results.updatedEncUser = encResults.value;
    results.updatedVmtUser = vmtResults.value;
    results.wasSuccess = didUpdateEnc && didUpdateVmt;
    encDb.close();
    vmtDb.close();
    return results;
  } catch (err) {
    console.log('err', err);
    if (encDb) {
      encDb.close();
    }

    if (vmtDb) {
      vmtDb.close();
    }
    return results;
  }
};
