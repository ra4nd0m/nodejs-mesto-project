import { Request, Response, NextFunction } from 'express';
import { logRequest, logError } from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logRequest(req);
  next();
};

export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logError(err, req);
  next(err);
};
