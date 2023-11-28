const userRouter = require('express').Router();

const { getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/me', updateUserProfile);
userRouter.patch('/me/avatar', updateUserAvatar);

module.exports = userRouter;
