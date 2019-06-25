import crypto from 'crypto';

export const getResetToken = function(size: number): Promise<string> {
  return new Promise(
    (resolve, reject): void => {
      crypto.randomBytes(
        size,
        (err, buf): void => {
          if (err) {
            reject(err);
          } else {
            const token = buf.toString('hex');
            resolve(token);
          }
        }
      );
    }
  );
};
