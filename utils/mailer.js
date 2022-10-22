const nodemailer = require('nodemailer');

async function sendMail(mailOptions) {
	const transport = nodemailer.createTransport({
		host: process.env.MAIL_HOST,
		port: process.env.MAIL_PORT,
		auth: {
			user: process.env.MAIL_USER,
			pass: process.env.MAIL_PASS,
		},
	});

	await transport.sendMail({
		from: process.env.MAIL_FROM,
		to: mailOptions.to,
		subject: mailOptions.subject,
		text: mailOptions.text,
	});
}

module.exports = sendMail;
