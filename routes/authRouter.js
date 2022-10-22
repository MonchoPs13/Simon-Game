const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/logout', authController.logout);
router.post('/signup', authController.register);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.get('/forgotPassword/:token', authController.resetPassword);
router.patch(
	'/updateUserPassword',
	authController.protectRoute,
	authController.updateUserPassword
);

module.exports = router;
