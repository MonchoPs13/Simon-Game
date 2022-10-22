const AppError = require('../models/errorModel');

function handleOperational(err, res) {
	res.status(err.statusCode).json({
		status: 'fail',
		message: err.message,
	});
}

function handleNonOperational(err, res) {
	console.log(`ERROR: ${err.stack}`);

	res.status(500).json({
		status: 'error',
		message:
			process.env.NODE_ENV === 'development'
				? err
				: 'Something went wrong, please try again later',
	});
}

function globalErrorHandler(err, req, res, next) {
	if (err instanceof AppError) handleOperational(err, res);
	else if (err.constructor.name === 'ValidationError') {
		const message = err.errors[Object.keys(err.errors)[0]].message;
		handleOperational(new AppError(message, 400), res);
	} else if (err.message.includes('duplicate key')) {
		const message = `A user already exists with that ${Object.keys(
			err.keyPattern
		).at(0)}`;
		handleOperational(new AppError(message, 400), res);
	} else handleNonOperational(err, res);
}

module.exports = globalErrorHandler;
