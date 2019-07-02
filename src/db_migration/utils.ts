import mongoose from 'mongoose';

export const connect = function connectToDb(
  url: string,
): Promise<mongoose.Connection> {
  return new Promise(
    (resolve, reject): void => {
      const db = mongoose.createConnection(url, { useNewUrlParser: true });

      db.on(
        'error',
        (err): void => {
          reject(err);
        },
      );

      db.on(
        'connected',
        (): void => {
          console.log(`connected to ${url}`);
          resolve(db);
        },
      );
    },
  );
};

export const find = function(
  db: mongoose.Connection,
  collection: string,
  filter = {},
): Promise<any[]> {
  return new Promise(
    (resolve, reject): void => {
      db.collection(collection)
        .find(filter)
        .toArray(
          (err, results): void => {
            if (err) {
              reject(err);
            }
            resolve(results);
          },
        );
    },
  );
};

export const findOne = function(
  db: mongoose.Connection,
  collection: string,
  filter = {},
): Promise<any> {
  return new Promise(
    (resolve, reject): void => {
      db.collection(collection)
        .findOne(filter)
        .then(
          (doc): void => {
            resolve(doc);
          },
        )
        .catch(reject);
    },
  );
};
