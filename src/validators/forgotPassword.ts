import { Request, Response, NextFunction } from 'express';

import { forgotPasswordRequest } from './schema';
import { validatePostRequest } from './base';

export const validateForgotPasswordRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  validatePostRequest(req, res, next, forgotPasswordRequest);
};
