import { Request, Response } from 'express';
import Card from '../models/card';
import { handleError, MESSAGES, NOT_FOUND } from '../utils/errorHandler';

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find().populate('owner likes');
    return res.status(200).json(cards);
  } catch (err) {
    return handleError(err, res);
  }
};

export const createCard = async (req: Request, res: Response) => {
  try {
    const { name, link } = req.body;
    const newCard = await Card.create({ name, link, owner: req.user!._id });
    return res.status(201).json(newCard);
  } catch (err) {
    return handleError(err, res);
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const deleted = await Card.findByIdAndDelete(req.params.cardId);
    if (!deleted) return res.status(NOT_FOUND).json({ message: MESSAGES.cardNotFound });
    return res.status(200).json({ message: 'Card deleted' });
  } catch (err) {
    return handleError(err, res);
  }
};

export const likeCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user!._id } },
      { new: true },
    ).populate('owner likes');
    if (!card) {
      return res.status(NOT_FOUND).json({ message: MESSAGES.cardNotFound });
    }
    return res.status(200).json(card);
  } catch (err) {
    return handleError(err, res);
  }
};

export const dislikeCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user!._id } },
      { new: true },
    ).populate('owner likes');
    if (!card) {
      return res.status(NOT_FOUND).json({ message: MESSAGES.cardNotFound });
    }
    return res.status(200).json(card);
  } catch (err) {
    return handleError(err, res);
  }
};
