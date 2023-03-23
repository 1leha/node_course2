const { Router } = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');

const router = Router();

router.post('/signup', authMiddleware.checkSignupUserData, authController.signup);
router.post('/login', authController.login);

module.exports = router;
