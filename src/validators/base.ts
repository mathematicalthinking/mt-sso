import { Request, Response, NextFunction } from 'express';
import { validateSchema } from '../utilities/joi';
import { ValidationErrorResponse } from '../types';
import { Schema } from 'joi';

import { basicTokenRequest } from './schema';

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

export const validateRequestParams = async (
  req: Request,
  res: Response,
  next: NextFunction,
  schema: Schema,
): Promise<void> => {
  try {
    let [validationError, validatedParams] = await validateSchema(
      req.params,
      schema,
    );
    if (validationError === null) {
      // validatedParams will have the appropriate string fields trimmed and in correct case
      req.params = validatedParams;
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

export const validateBasicToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  return validateRequestParams(req, res, next, basicTokenRequest);
};
