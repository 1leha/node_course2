const { Router } = require('express');

const userRolesEnum = require('../constants/userRolesEnum');
const {
  createUser,
  getUsersList,
  getUserById,
  updateUserById,
  deleteUserById
} = require('../controllers/userCotroller');
const { checkUserId, checkCreateUserData, checkUpdateUserData } = require('../middlewares/userMiddleware');
const { protect, allowFor } = require('../middlewares/authMiddleware');

const router = Router();

router.use(protect);
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
