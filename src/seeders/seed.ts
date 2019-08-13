/* eslint-disable @typescript-eslint/no-angle-bracket-type-assertion */
import data from './index';
import mongoose from 'mongoose';
import { InsertWriteOpResult } from 'mongodb';
const dbURI = `mongodb://localhost:27017/mtlogin_test`;

const clearDB = async (): Promise<any> => {
  await mongoose.connect(dbURI, { useNewUrlParser: true });
  return mongoose.connection.db.dropDatabase();
};

const seedCollection = (
  db: mongoose.Connection,
  collectionName: string,
  data: any[],
): Promise<InsertWriteOpResult> => {
  return db.collection(collectionName).insertMany(data);
};

export const seed = async (collections = Object.keys(data)): Promise<void> => {
  try {
    await clearDB();

    let db = mongoose.connection;

    let seededCollections = collections.map(
      (collectionName): Promise<{ [index: string]: number }[]> => {
        return seedCollection(
          db,
          collectionName,
          (<any>data)[collectionName],
        ).then(
          (writeResults: InsertWriteOpResult): any => {
            return `${collectionName}: ${writeResults.result.n}`;
          },
        );
      },
    );

    let results = await Promise.all(seededCollections);

    console.log('Seed Results: ', results);
    mongoose.connection.close();
  } catch (err) {
    console.log('Error seeding: ', err);
  }
};
