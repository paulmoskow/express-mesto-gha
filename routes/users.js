const userRouter = require('express').Router();

const { getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getUserData,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.get('/me', getUserData);
userRouter.patch('/me', updateUserProfile);
userRouter.patch('/me/avatar', updateUserAvatar);

module.exports = userRouter;
