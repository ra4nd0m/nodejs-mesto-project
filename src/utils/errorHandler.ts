import { Response } from 'express';
import mongoose from 'mongoose';

export const BAD_REQUEST = 400;
export const NOT_FOUND = 404;
export const SERVER_ERROR = 500;
export const UNAUTHORIZED = 401;
export const CONFLICT = 409;
export const FORBIDDEN = 403;

export const MESSAGES = {
  badRequest: 'Invalid data provided',
  notFound: 'Requested resource not found',
  serverError: 'An error occurred on the server',
  invalidId: 'Invalid ID format',
  cardNotFound: 'Card not found',
  userNotFound: 'User not found',
  invalidCardData: 'Invalid card data',
  invalidUserData: 'Invalid user data',
  invalidAvatar: 'Invalid avatar URL',
  invalidProfile: 'Invalid profile data',
  unauthorized: 'Authentication required',
  invalidCredentials: 'Incorrect email or password',
  emailExists: 'Email already exists',
  forbidden: 'You do not have permission to perform this action',
  cardNotOwned: 'You can only delete your own cards',
};

export const handleError = (err: unknown, res: Response): Response => {
  if (err instanceof mongoose.Error.CastError) {
    return res.status(BAD_REQUEST).json({ message: MESSAGES.invalidId });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    if (err.message.includes('avatar')) {
      return res.status(BAD_REQUEST).json({ message: MESSAGES.invalidAvatar });
    }
    if (err.message.includes('link')) {
      return res.status(BAD_REQUEST).json({ message: MESSAGES.invalidCardData });
    }
    return res.status(BAD_REQUEST).json({ message: MESSAGES.badRequest });
  }

  return res.status(SERVER_ERROR).json({ message: MESSAGES.serverError });
};
