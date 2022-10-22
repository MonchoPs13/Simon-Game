const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: `${__dirname}/config.env` });

const DB_STRING = process.env.DATABASE_CONNECT.replace(
	'<password>',
	process.env.DATABASE_PWD
);

mongoose
	.connect(DB_STRING)
	.then(() => console.log('DB connection succesful'))
	.catch(err => {
		console.log(`Couldn't conncet to the database: ${err}`);
		process.exit(1);
	});

process.on('uncaughtException', err => {
	console.log(`Uncaught Exception: ${err}`);
	process.exit(1);
});

const server = app.listen(process.env.PORT, () => {
	console.log(`App running on http://127.0.0.1:${process.env.PORT}`);
});

process.on('unhandledRejection', err => {
	console.log(`Unhandled Rejection: ${err}`);
	server.close(() => process.exit(1));
});
