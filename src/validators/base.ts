import { Request, Response, NextFunction } from 'express';
import { validateSchema } from '../utilities/joi';
import { ValidationErrorResponse } from '../types';
import { Schema } from 'joi';

export const validatePostRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
  schema: Schema,
): Promise<void> => {
  try {
    let [validationError, validatedBody] = await validateSchema(
      req.body,
      schema,
    );

    if (validationError === null) {
      // validatedBody will have the appropriate string fields trimmed and in correct case
      req.body = validatedBody;
      return next();
    }
    let firstError = validationError.details[0];

    let data: ValidationErrorResponse = {
      message: firstError.message,
      field: firstError.context ? firstError.context.label : undefined,
      value: firstError.context ? firstError.context.value : undefined,
    };

    res.json(data);
  } catch (err) {
    next(err);
  }
};
