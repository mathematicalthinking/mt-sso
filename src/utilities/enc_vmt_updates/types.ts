import { FindAndModifyWriteOpResultObject } from 'mongodb';
import { MongooseOId } from '../../types';

export interface EncVmtUserUpdateResults {
  updatedEncUser?: FindAndModifyWriteOpResultObject;
  updatedVmtUser?: FindAndModifyWriteOpResultObject;
  wasSuccess: boolean;
}
export interface EncUserUpdateDetails {
  filter: any;
  update: any;
}

export interface VmtUserUpdateDetails {
  filter: any;
  update: any;
}

export interface EncConfirmEmailUpdate {
  filter: { _id: MongooseOId; isEmailConfirmed?: boolean };
  update: {
    $set: {
      isEmailConfirmed: boolean;
      confirmEmailDate?: Date;
      lastModifiedDate: Date;
    };
  };
}

export interface VmtConfirmEmailUpdate {
  filter: { _id: MongooseOId; isEmailConfirmed?: boolean };
  update: {
    $set: {
      isEmailConfirmed: boolean;
      confirmEmailDate?: Date;
      updatedAt: Date;
    };
  };
}
