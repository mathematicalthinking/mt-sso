import {
  EncUserUpdateDetails,
  VmtUserUpdateDetails,
  EncVmtUserUpdateResults,
} from './types';
import EncUser from '../../models/EncUser';
import VmtUser from '../../models/VmtUser';

export const updateEncVmtUsers = async (
  encDetails: EncUserUpdateDetails,
  vmtDetails: VmtUserUpdateDetails,
): Promise<EncVmtUserUpdateResults> => {
  let results: EncVmtUserUpdateResults = { wasSuccess: false };

  try {
    let [encResults, vmtResults] = await Promise.all([
      EncUser.findByIdAndUpdate(encDetails.filter, encDetails.update, {
        new: true,
      }),
      VmtUser.findByIdAndUpdate(vmtDetails.filter, vmtDetails.update, {
        new: true,
      }),
    ]);

    let didUpdateEnc = encResults !== null;
    let didUpdateVmt = vmtResults !== null;

    results.updatedEncUser = encResults;
    results.updatedVmtUser = vmtResults;
    results.wasSuccess = didUpdateEnc && didUpdateVmt;
    return results;
  } catch (err) {
    console.log('err', err);

    return results;
  }
};
