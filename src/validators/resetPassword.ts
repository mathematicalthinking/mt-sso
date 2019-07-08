import { Request, Response, NextFunction } from 'express';

import {
  resetPasswordByTokenRequest,
  resetPasswordByIdRequest,
} from './schema';
import { validatePostRequest } from './base';

export const validateResetPasswordByToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  validatePostRequest(req, res, next, resetPasswordByTokenRequest);
};

export const validateResetPasswordById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  validatePostRequest(req, res, next, resetPasswordByIdRequest);
};
