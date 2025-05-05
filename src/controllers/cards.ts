import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import mongoose from 'mongoose';
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError
} from '../errors';
import { MESSAGES } from '../utils/errorHandler';

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find().populate('owner likes');
    return res.status(200).json(cards);
  } catch (err) {
    return next(err);
  }
};

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const newCard = await Card.create({ name, link, owner: req.user!._id });
    return res.status(201).json(newCard);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError(MESSAGES.invalidCardData));
    }
    return next(err);
  }
};

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findById(req.params.cardId);

    if (!card) {
      return next(new NotFoundError(MESSAGES.cardNotFound));
    }

    if (card.owner.toString() !== req.user!._id) {
      return next(new ForbiddenError(MESSAGES.cardNotOwned));
    }

    await Card.findByIdAndDelete(req.params.cardId);
    return res.status(200).json({ message: 'Card deleted' });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError(MESSAGES.invalidId));
    }
    return next(err);
  }
};

export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user!._id } },
      { new: true },
    ).populate('owner likes');

    if (!card) {
      return next(new NotFoundError(MESSAGES.cardNotFound));
    }

    return res.status(200).json(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError(MESSAGES.invalidId));
    }
    return next(err);
  }
};

export const dislikeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user!._id } },
      { new: true },
    ).populate('owner likes');

    if (!card) {
      return next(new NotFoundError(MESSAGES.cardNotFound));
    }

    return res.status(200).json(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError(MESSAGES.invalidId));
    }
    return next(err);
  }
};