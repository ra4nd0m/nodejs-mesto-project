import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { MESSAGES } from '../utils/errorHandler';
import { UnauthorizedError } from '../errors';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new UnauthorizedError(MESSAGES.unauthorized));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { _id: string };
    req.user = { _id: payload._id };
    return next();
  } catch (err) {
    return next(new UnauthorizedError(MESSAGES.unauthorized));
  }
};

export default auth;
