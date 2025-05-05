import express from 'express';
import {
  getUsers, getUserById, createUser, updateProfile, updateAvatar,
} from '../controllers/users';

const userRoutes = express.Router();

userRoutes.get('/', getUsers);
userRoutes.get('/:userId', getUserById);
userRoutes.post('/', createUser);
userRoutes.patch('/me', updateProfile);
userRoutes.patch('/me/avatar', updateAvatar);

export default userRoutes;
