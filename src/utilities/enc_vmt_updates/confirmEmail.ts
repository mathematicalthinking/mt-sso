import {
  EncConfirmEmailUpdate,
  VmtConfirmEmailUpdate,
  EncVmtUserUpdateResults,
} from './types';
import { updateEncVmtUsers } from './base';
import { MongooseOId } from '../../types';

export const confirmEncVmtEmails = (
  encUserId: MongooseOId,
  vmtUserId: MongooseOId,
): Promise<EncVmtUserUpdateResults> => {
  let encUpdate: EncConfirmEmailUpdate = {
    filter: { _id: encUserId },
    update: {
      $set: {
        isEmailConfirmed: true,
        confirmEmailDate: new Date(),
        lastModifiedDate: new Date(),
      },
    },
  };

  let vmtUpdate: VmtConfirmEmailUpdate = {
    filter: { _id: vmtUserId },
    update: {
      $set: {
        isEmailConfirmed: true,
        confirmEmailDate: new Date(),
        updatedAt: new Date(),
      },
    },
  };

  return updateEncVmtUsers(encUpdate, vmtUpdate);
};

export const unconfirmEncVmtEmails = (
  encUserId: MongooseOId,
  vmtUserId: MongooseOId,
): Promise<EncVmtUserUpdateResults> => {
  let encUpdate: EncConfirmEmailUpdate = {
    filter: { _id: encUserId, isEmailConfirmed: true },
    update: {
      $set: {
        isEmailConfirmed: false,
        confirmEmailDate: undefined,
        lastModifiedDate: new Date(),
      },
    },
  };

  let vmtUpdate: VmtConfirmEmailUpdate = {
    filter: { _id: vmtUserId, isEmailConfirmed: true },
    update: {
      $set: {
        isEmailConfirmed: false,
        confirmEmailDate: undefined,
        updatedAt: new Date(),
      },
    },
  };

  return updateEncVmtUsers(encUpdate, vmtUpdate);
};
