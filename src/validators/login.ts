import express from 'express';
import { loginRequest } from './schema';
import { validatePostRequest } from './base';

export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  validatePostRequest(req, res, next, loginRequest);
};
