const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.login = (req, res, next) => {
	res.render('loginForm', {
		action: `/api/v1/auth/login`,
		id: `login`,
		title: `Log In`,
	});
};

exports.signup = (req, res, next) => {
	res.render('signupForm', {
		action: `/api/v1/auth/signup`,
		id: `signup`,
		title: `Sign Up`,
	});
};

exports.home = catchAsync(async (req, res, next) => {
	let user = await User.findById(req.user?._id);
	user = await user?.populate({
		path: 'friends',
		select: 'username highscore -_id',
	});
	user = await user?.populate({
		path: 'friendsAccept',
		select: 'username',
	});

	res.render('homeBase', {
		user,
	});
});

exports.forgotPassword = (req, res, next) => {
	res.render('forgotPasswordForm', {
		action: `/api/v1/auth/forgotPassword`,
		id: `forgotPassword`,
		title: `Forgot Password`,
	});
};
