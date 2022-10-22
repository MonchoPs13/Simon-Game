const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../models/errorModel');
const catchAsync = require('../utils/catchAsync');
const sendMail = require('../utils/mailer');

function signAndSendToken(user, req, res) {
	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

	const cookieOptions = {
		httpOnly: true,
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 360 * 1000
		),
		secure: req.secure,
	};

	res.cookie('jwt', token, cookieOptions);
	res.status(200).json({
		status: 'success',
		message: 'Operation completed successfuly',
		data: {
			user,
		},
	});
}

exports.register = catchAsync(async (req, res, next) => {
	const user = await User.create({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
	});

	signAndSendToken(user, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
	const user = await User.findOne({ username: req.body.username });
	const passwordIsCorrect = await user?.checkPassword(req.body.password);

	if (!user || !passwordIsCorrect)
		return next(new AppError(`Invalid username or password`, 401));

	signAndSendToken(user, req, res);
});

const protectRouteJWT = async jwtToken => {
	try {
		const isValidJWT = await promisify(jwt.verify)(
			jwtToken,
			process.env.JWT_SECRET
		);

		if (!isValidJWT)
			throw new AppError(`Invalid JWT, please log in again`, 401);

		return isValidJWT;
	} catch (error) {
		return error;
	}
};

const protectRouteToken = async token => {
	try {
		const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
		const user = await User.findOne({ passwordToken: hashedToken });

		if (!user)
			throw new AppError(`Invalid token, please request a new one`, 400);

		return user;
	} catch (error) {
		return error;
	}
};

exports.protectRoute = catchAsync(async (req, res, next) => {
	const jwt = req.cookies.jwt;
	const token = req.body.token;
	let user, passwordChangedAfter;

	if (jwt) {
		const validJWT = await protectRouteJWT(jwt);
		user = await User.findById(validJWT.id);
		req.validatedWithJWT = true;
		passwordChangedAfter =
			Number.parseInt(validJWT.iat * 1000) < user.passwordChangedAt.getTime();
	} else if (token) user = await protectRouteToken(token);

	if (!user || user instanceof AppError || passwordChangedAfter)
		return next(
			new AppError(`Invalid or expired token, please log in again`, 401)
		);

	req.user = user;
	next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });

	if (!user) return next(new AppError(`Invalid email`, 400));

	const token = (await promisify(crypto.randomBytes)(32)).toString('hex');
	await user.setPasswordToken(token);

	const mailOptions = {
		to: user.email,
		subject: 'Your password reset (valid for 10 minutes)',
		text: `Hi ${user.username}, your password reset link is ${
			req.protocol
		}://${req.get('host')}/api/v1/auth/forgotPassword/${token}`,
	};

	try {
		await sendMail(mailOptions);
	} catch (err) {
		return next(new AppError(`Couldn't send email, please try again`));
	}

	res.status(200).json({
		status: 'success',
		message: `Email sent, check your inbox and follow the instructions`,
	});
});

exports.resetPassword = catchAsync(async (req, res, next) => {
	const { token } = req.params;
	const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
	const user = await User.findOne({
		passwordToken: hashedToken,
		passwordTokenExpires: { $gte: Date.now() },
	});

	if (!user)
		return next(
			new AppError(
				`Invalid password token, please request another email for a new one`,
				400
			)
		);

	res.render('resetPasswordForm', {
		action: `/api/v1/auth/updateUserPassword`,
		id: `resetPassword`,
		title: `Reset Password`,
		method: `PATCH`,
		token,
	});
});

exports.updateUserPassword = catchAsync(async (req, res, next) => {
	const filteredUpdate = {};
	const allowedFields = ['username', 'password', 'passwordConfirm'];

	allowedFields.forEach(field => {
		const value = req.body[field];
		if (value) filteredUpdate[field] = value;
	});

	const user = await User.findById(req.user._id);

	if (!user) return next(new AppError(`Couldn't update user, try again later`));
	if (req.validatedWithJWT) {
		const correctPassword = await user.checkPassword(req.body.passwordCurrent);
		if (!correctPassword)
			return next(new AppError(`Current password is incorrect`, 401));
	}

	for (let property in filteredUpdate) {
		user[property] = filteredUpdate[property];
	}

	await user.save();
	signAndSendToken(user, req, res);
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
	if (!req.cookies.jwt) return next();

	const verifiedJWT = await promisify(jwt.verify)(
		req.cookies.jwt,
		process.env.JWT_SECRET
	);

	if (verifiedJWT) req.user = await User.findById(verifiedJWT.id);
	next();
});

exports.logout = (req, res, next) => {
	res.clearCookie('jwt').redirect('/');
};
