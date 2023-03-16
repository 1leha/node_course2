const { Router } = require('express');

const {
  createUser,
  getUsersList,
  getUserById,
  updateUserById,
  deleteUserById
} = require('../controllers/userCotroller');
const { checkUserId, checkCreateUserData } = require('../middlewares/userMiddleware');

const router = Router();

// router.post('/', createUser);
// router.get('/', getUsersList);

// router.get('/:id', checkUserId, getUserById);

router
  .route('/')
  .post(checkCreateUserData, createUser)
  .get(getUsersList);

router.use('/:id', checkUserId);
router
  .route('/:id')
  .get(getUserById)
  .patch(updateUserById)
  .delete(deleteUserById);

module.exports = router;
