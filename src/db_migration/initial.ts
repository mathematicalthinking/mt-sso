import {
  addEncUsers,
  createVmtCounterparts,
  findDuplicateUsers,
} from './addEncUsers';
import { addVmtUsers, createEncCounterparts } from './addVmtUsers';

async function initialMigration(): Promise<void> {
  try {
    await findDuplicateUsers();

    await addEncUsers();
    await addVmtUsers();

    await createVmtCounterparts();
    await createEncCounterparts();
    console.log('done!');
  } catch (err) {
    console.log('Error initial migration: ', err);
  }
}

initialMigration();
