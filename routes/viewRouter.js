const express = require('express');
const authController = require('../controllers/authController');
const viewController = require('../controllers/viewController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewController.home);
router.get('/login', viewController.login);
router.get('/signup', viewController.signup);
router.get('/forgotPassword', viewController.forgotPassword);

module.exports = router;
