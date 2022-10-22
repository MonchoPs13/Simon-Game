const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.get(
	'/leaderboards/:type',
	authController.isLoggedIn,
	userController.getLeaderboards
);

router.patch(
	'/updateUser',
	authController.protectRoute,
	userController.updateUser
);

router.post(
	'/sendFriendRequest/:friendUsername',
	authController.protectRoute,
	userController.sendFriendRequest
);

router.post(
	'/addFriend/:type/:friendUsername',
	authController.protectRoute,
	userController.addFriend
);

router.get(
	'/searchFriend/:query',
	authController.protectRoute,
	userController.searchFriend
);

module.exports = router;
