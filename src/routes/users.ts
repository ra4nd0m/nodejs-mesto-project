import express from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import {
  getUsers, getUserById, updateProfile, updateAvatar,
  getCurrentUser,
} from '../controllers/users';

const userRoutes = express.Router();

const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/i;

userRoutes.get('/me', getCurrentUser);
userRoutes.get('/', getUsers);

userRoutes.get('/:userId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserById);

userRoutes.patch('/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
  }),
}), updateProfile);

userRoutes.patch('/me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().pattern(urlPattern).required(),
  }),
}), updateAvatar);

export default userRoutes;
