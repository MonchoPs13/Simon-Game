const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const globalErrorHandler = require('./controllers/errorController');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const viewRouter = require('./routes/viewRouter');

const app = express();

app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);

/* Middlewares and Security */
app.disable('x-powered-by');
const limiter = rateLimit({
	windowMs: 1000 * 360,
	max: 150,
	legacyHeaders: false,
	message: 'Too many requests from this IP, please come back in an hour',
});
app.use(limiter);
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

/* Server routes */
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/', viewRouter);

app.use(globalErrorHandler);

module.exports = app;
