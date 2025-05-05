import { Request, Response } from 'express';
import User from '../models/user';
import {
  BAD_REQUEST, handleError, MESSAGES, NOT_FOUND,
} from '../utils/errorHandler';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    return handleError(err, res);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(NOT_FOUND).json({ message: MESSAGES.userNotFound });
    }
    return res.status(200).json(user);
  } catch (err) {
    return handleError(err, res);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar } = req.body;
    if (!name || !about || !avatar) {
      return res.status(BAD_REQUEST).json({ message: MESSAGES.invalidUserData });
    }
    const newUser = await User.create({ name, about, avatar });
    return res.status(201).json(newUser);
  } catch (err) {
    return handleError(err, res);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user!._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      return res.status(NOT_FOUND).json({ message: MESSAGES.userNotFound });
    }
    return res.status(200).json(updatedUser);
  } catch (err) {
    return handleError(err, res);
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  try {
    const { avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user!._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      return res.status(NOT_FOUND).json({ message: MESSAGES.userNotFound });
    }
    return res.status(200).json(updatedUser);
  } catch (err) {
    return handleError(err, res);
  }
};
