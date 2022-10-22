const AppError = require('../models/errorModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.updateUser = catchAsync(async (req, res, next) => {
	const filteredUpdate = {};
	const allowedFields = ['highscore'];

	allowedFields.forEach(field => {
		const value = req.body[field];
		if (value) filteredUpdate[field] = value;
	});

	const user = await User.findById(req.user._id);

	if (!user)
		return next(new AppError(`Couldn't update user, try again later`, 500));

	if (filteredUpdate.highscore) {
		filteredUpdate.highscore =
			filteredUpdate.highscore > user.highscore
				? req.body.highscore
				: user.highscore;
	}

	await user.update(filteredUpdate);

	res.status(200).json({
		status: 'success',
		message: 'User updated successfuly',
	});
});

exports.sendFriendRequest = catchAsync(async (req, res, next) => {
	if (!req.params.friendUsername)
		return next(new AppError(`You need to specify a username`, 400));

	const friend = await User.findOne({ username: req.params.friendUsername });

	if (!friend)
		return next(new AppError(`No user found with that username`, 400));

	if (friend.equals(req.user))
		return next(new AppError(`You can't friend yourself`, 400));

	if (req.user.friendsPending.includes(friend._id.toString()))
		return next(
			new AppError(`You already sent a friend request to this user`, 400)
		);

	if (friend.friendsPending.includes(req.user._id.toString()))
		return next(
			new AppError(`That user has already sent you a friend request`, 400)
		);

	if (req.user.friends.includes(friend.id.toString()))
		return next(new AppError(`You are already friends with this user`, 400));

	req.user.friendsPending.push(friend._id);
	friend.friendsAccept.push(req.user._id);
	await req.user.save({ validateModifiedOnly: true });
	await friend.save({ validateModifiedOnly: true });

	res.status(200).json({
		status: 'success',
		message: 'Friend request sent',
	});
});

exports.addFriend = catchAsync(async (req, res, next) => {
	if (req.params.type !== 'accept' && req.params.type !== 'deny')
		return next(
			new AppError(`The request type must be either accept or deny`, 400)
		);

	const friend = await User.findOne({ username: req.params.friendUsername });

	if (!friend)
		return next(new AppError(`Couldn't find a user with that username`, 400));

	const friendIndex = req.user.friendsAccept.indexOf(friend._id.toString());
	if (friendIndex === -1)
		return next(
			new AppError(`That user hasn't sent you a friend request`, 400)
		);

	req.user.friendsAccept.splice(friendIndex, 1);
	const userIndex = friend.friendsPending.indexOf(req.user._id.toString());
	if (userIndex !== -1) friend.friendsPending.splice(userIndex, 1);

	if (req.params.type === 'accept') {
		req.user.friends.push(friend._id);
		friend.friends.push(req.user._id);
	}

	await req.user.save({ validateModifiedOnly: true });
	await friend.save({ validateModifiedOnly: true });

	res.status(200).json({
		status: 'success',
		message: `Friend request ${
			req.params.type === 'accept' ? 'accepted' : 'denied'
		}`,
	});
});

exports.searchFriend = catchAsync(async (req, res, next) => {
	const escapedREGEX = req.params.query.replace(
		/[-\/\\^$*+?.()|[\]{}]/g,
		'\\$&'
	);
	const queryREGEX = new RegExp(`^${escapedREGEX}`, 'i');

	const users = await User.find({ username: { $regex: queryREGEX } })
		.limit(5)
		.select('username -_id');

	res.status(200).json({
		status: 'success',
		results: users.length,
		data: {
			users,
		},
	});
});

exports.getLeaderboards = catchAsync(async (req, res, next) => {
	if (req.params.type !== 'global' && req.params.type !== 'friends')
		return next(
			new AppError(
				'The leaderboards type must be either global or friends',
				400
			)
		);

	let users;

	if (req.params.type === 'global') {
		users = await User.find({ highscore: { $gt: 0 } })
			.sort({ highscore: -1 })
			.select('username highscore -_id');
	}

	if (req.params.type === 'friends') {
		if (!req.user)
			return next(
				new AppError(
					`You must be logged in to view your friends leaderboards`,
					401
				)
			);

		users = [];

		const user = await req.user.populate({
			path: 'friends',
			select: '-_id highscore username',
		});

		user.friends.forEach(friend => users.push(friend));
		users.sort((a, b) => Number(b.highscore) - Number(a.highscore));
	}

	res.status(200).json({
		status: 'success',
		results: users.length,
		data: {
			users,
		},
	});
});
