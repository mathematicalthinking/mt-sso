import * as mongoose from 'mongoose';

export const connect = function connectToDb(
  url: string
): Promise<mongoose.Connection> {
  return new Promise(
    (resolve, reject): void => {
      mongoose.connect(url);

      const db = mongoose.connection;

      db.on(
        'error',
        (err): void => {
          reject(err);
        }
      );

      db.on(
        'connected',
        (): void => {
          console.log(`connected to ${url}`);
          resolve(db);
        }
      );
    }
  );
};

export const find = function(
  db: mongoose.Connection,
  collection: string,
  filter = {}
): Promise<any[]> {
  return new Promise(
    (resolve, reject): void => {
      db.collection(collection)
        .find(filter)
        .toArray(
          (err, results): void => {
            if (err) {
              mongoose.connection.close();
              reject(err);
            }
            mongoose.connection.close();
            resolve(results);
          }
        );
    }
  );
};
