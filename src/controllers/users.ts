import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import {
  BAD_REQUEST, CONFLICT, handleError, MESSAGES, NOT_FOUND,
} from '../utils/errorHandler';
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from '../errors';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError(MESSAGES.invalidId));
    } else {
      return next(err);
    }
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(new NotFoundError(MESSAGES.userNotFound));
    }
    return res.status(200).json(user);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError(MESSAGES.invalidId));
    }
    return next(err);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about, avatar, email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name, about, avatar, email, password: hash,
    });

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json(userResponse);
  } catch (err: any) {
    if (err.code === 11000) {
      return next(new ConflictError(MESSAGES.emailExists));
    }
    return next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new UnauthorizedError(MESSAGES.invalidCredentials));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new UnauthorizedError(MESSAGES.invalidCredentials));
    }

    const token = jwt.sign(
      { _id: user._id },
      JWT_SECRET,
      { expiresIn: '7d' },
    );

    res.cookie('jwt', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(200).json({ _id: user._id });
  } catch (err) {
    return next(err);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user!._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      return next(new NotFoundError(MESSAGES.userNotFound));
    }
    return res.status(200).json(updatedUser);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError(MESSAGES.invalidProfile));
    }
    return next(err);
  }
};

export const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user!._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      return next(new NotFoundError(MESSAGES.userNotFound));
    }
    return res.status(200).json(updatedUser);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError(MESSAGES.invalidAvatar));
    }
    return next(err);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!._id);
    if (!user) {
      return next(new NotFoundError(MESSAGES.userNotFound));
    }
    return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
};