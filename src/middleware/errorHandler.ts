import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { CONFLICT, SERVER_ERROR, MESSAGES } from '../utils/errorHandler';
import { HttpError } from '../errors';

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
}

// eslint-disable-next-line no-unused-vars
const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  if (err.code === 11000) {
    return res.status(CONFLICT).json({ message: MESSAGES.emailExists });
  }

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ message: err.message });
  }

  const statusCode = err.statusCode || SERVER_ERROR;
  const message = statusCode === SERVER_ERROR ? MESSAGES.serverError : err.message;

  return res.status(statusCode).json({ message });
};

export default errorHandler;
