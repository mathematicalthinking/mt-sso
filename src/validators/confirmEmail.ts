import { Request, Response, NextFunction } from 'express';

import { confirmEmailByIdRequest } from './schema';
import { validatePostRequest } from './base';

export const validateConfirmEmailByIdRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  validatePostRequest(req, res, next, confirmEmailByIdRequest);
};
