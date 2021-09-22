import * as express from 'express';

export const sendError = {
  InternalError: function(err: string | null, res: express.Response): void {
    console.log('Internal Error: ', err, ', Response: ', res);
    res.status(500).json({
      errorMessage: err || 'Internal Error',
    });
  },
  NotFoundError: function(err: string | null, res: express.Response): void {
    res.status(404).json({
      errorMessage: err || 'Not Found',
    });
  },
  BadMethodError: function(err: string | null, res: express.Response): void {
    res.status(405).json({
      errorMessage: err || 'Bad Method',
    });
  },
  NotAuthorizedError: function(
    err: string | null,
    res: express.Response,
  ): void {
    res.status(403).json({
      errorMessage: err || 'Not Authorized',
    });
  },
  InvalidCredentialsError: function(
    err: string | null,
    res: express.Response,
  ): void {
    res.status(401).json({
      errorMessage: err || 'Unauthorized',
    });
  },
  InvalidArgumentError: function(
    err: string | null,
    res: express.Response,
  ): void {
    res.status(409).json({
      errorMessage: err || 'Invalid Argument',
    });
  },
  InvalidContentError: function(
    err: string | null,
    res: express.Response,
  ): void {
    res.status(400).json({
      errorMessage: err || 'Invalid Content',
    });
  },
};
