import * as Joi from '@hapi/joi';

export const validateSchema = (
  value: unknown,
  schema: Joi.SchemaLike,
  options: Joi.ValidationOptions = {}
): Promise<[Joi.ValidationError | null, unknown]> => {
  return new Promise(
    (resolve, reject): void => {
      Joi.validate(
        value,
        schema,
        options,
        (err: Joi.ValidationError, val: unknown): void => {
          resolve([err, val]);
        }
      );
    }
  );
};
