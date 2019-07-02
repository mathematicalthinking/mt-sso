import {
  encSignupRequest as encSignupSchema,
  vmtSignupRequest as vmtSignupSchema,
} from './schema';
import { Request, Response, NextFunction } from 'express';

import { validatePostRequest } from './base';

export const validateEncSignup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  validatePostRequest(req, res, next, encSignupSchema);
};

export const validateVmtSignup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  validatePostRequest(req, res, next, vmtSignupSchema);
};
