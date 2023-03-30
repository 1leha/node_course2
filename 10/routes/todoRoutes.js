const { Router } = require('express');

const { protect } = require('../middlewares/authMiddleware');
const todoController = require('../controllers/todoController');

const router = Router();

router.use(protect);

router.post('/', todoController.createTodo);
router.get('/', todoController.getTodosList);

module.exports = router;
