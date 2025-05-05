import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UNAUTHORIZED, MESSAGES } from "../utils/errorHandler";

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(UNAUTHORIZED).send({ message: MESSAGES.unauthorized });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { _id: string };
    req.user = { _id: payload._id };
    return next();
  } catch (err) {
    return res.status(UNAUTHORIZED).send({ message: MESSAGES.unauthorized });
  }
}