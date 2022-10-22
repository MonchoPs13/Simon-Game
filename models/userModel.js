const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, `Please provide a username`],
		unique: true,
		maxLength: [13, `The username can't exceed 13 characters`],
		minLength: [3, `The username must contain at least 3 characters`],
	},
	email: {
		type: String,
		required: [true, `Please provide an email`],
		unique: true,
	},
	password: {
		type: String,
		required: [true, `Please provide a password`],
		maxLength: [15, `The password can't exceed 15 characters`],
		minLength: [6, `The password must contain at least 6 characters`],
	},
	passwordConfirm: {
		type: String,
		required: [true, `Please confirm your password`],
		validate: {
			validator: function (value) {
				return this.password === value;
			},
			message: `The password and confirmation values don't match`,
		},
	},
	passwordToken: String,
	passwordChangedAt: Date,
	passwordTokenExpires: Date,
	highscore: {
		type: Number,
		default: 0,
	},
	friends: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	friendsPending: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	friendsAccept: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],
});

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 10);
	this.passwordChangedAt = Date.now() - 1000;
	this.passwordConfirm = undefined;
	this.passwordToken = undefined;
	this.passwordTokenExpires = undefined;
	next();
});

/* Instance's methods */
userSchema.methods.checkPassword = async function (plainPassword) {
	try {
		return await bcrypt.compare(plainPassword, this.password);
	} catch (err) {
		return false;
	}
};

userSchema.methods.setPasswordToken = async function (plainToken) {
	this.passwordToken = crypto
		.createHash('sha256')
		.update(plainToken)
		.digest('hex');
	this.passwordTokenExpires = Date.now() + 1000 * 600;

	await this.save({ validateBeforeSave: false });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
