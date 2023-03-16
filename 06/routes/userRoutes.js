const { Router } = require('express');

const {
  createUser,
  getUsersList,
  getUserById,
  updateUserById,
  deleteUserById
} = require('../controllers/userCotroller');
const { checkUserId, checkCreateUserData, checkUpdateUserData } = require('../middlewares/userMiddleware');

const router = Router();

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
