import express from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import {
  getUsers, getUserById, updateProfile, updateAvatar,
  getCurrentUser,
} from '../controllers/users';
import URL_PATTERN from '../const/constants';

const userRoutes = express.Router();

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
    avatar: Joi.string().pattern(URL_PATTERN).required(),
  }),
}), updateAvatar);

export default userRoutes;
