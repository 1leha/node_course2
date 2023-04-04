const { Router } = require('express');

const userRolesEnum = require('../constants/userRolesEnum');
const {
  createUser,
  getUsersList,
  getUserById,
  updateUserById,
  deleteUserById,
  getMe,
  updateMe,
  updateMyPassword,
} = require('../controllers/userCotroller');
const {
  checkUserId,
  checkCreateUserData,
  checkUpdateUserData,
  uploadUserPhoto,
  checkPassword,
} = require('../middlewares/userMiddleware');
const { protect, allowFor } = require('../middlewares/authMiddleware');

const router = Router();

// all next routes are allowed for logged in users
router.use(protect);

router.get('/me', getMe);
router.patch('/update-me', uploadUserPhoto, updateMe);
router.patch('/update-my-password', checkPassword, updateMyPassword);

// all routes after are allowed only for specific user roles(admin)
router.use(allowFor(userRolesEnum.ADMIN));

router
  .route('/')
  .post(checkCreateUserData, createUser)
  .get(getUsersList);

router.use('/:id', checkUserId);
router
  .route('/:id')
  .get(getUserById)
  .patch(checkUpdateUserData, updateUserById)
  .delete(deleteUserById);

module.exports = router;
