const { Router } = require('express');

const { createUser, getUsersList, getUserById } = require('../controllers/userCotroller');
const { checkUserId } = require('../middlewares/userMiddleware');

const router = Router();

// router.post('/', createUser);
// router.get('/', getUsersList);

// router.get('/:id', checkUserId, getUserById);

router.route('/').post(createUser).get(getUsersList);

router.use('/:id', checkUserId);
router
  .route('/:id')
  .get(getUserById)
  .patch(getUserById)
  .delete(getUserById);

module.exports = router;
