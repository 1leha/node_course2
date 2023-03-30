const { Router } = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');

const router = Router();

router.post('/signup', authMiddleware.checkSignupUserData, authController.signup);
router.post('/login', authController.login);

// send email to restore password
router.post('/forgot-password', authController.forgotPassword);

// reset password using one time password
router.patch('/reset-password/:otp', authController.resetPassword);

module.exports = router;
