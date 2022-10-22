import { ALERT_DURATION } from './config.js';
import showAlert from './alert.js';

class Form {
	constructor(form, action, method) {
		this.form = form;
		this.action = form.getAttribute('action');
		this.method = form.getAttribute('method');
		this.form.addEventListener('submit', this.submit.bind(this));
	}

	async submit(e) {
		try {
			e.preventDefault();

			const fetchBody = {};
			const formData = new FormData(this.form);

			formData.forEach((value, key) => {
				fetchBody[key] = value;
			});

			if (this.form.id === 'resetPassword')
				fetchBody['token'] = e.submitter.dataset.token;

			const res = await fetch(this.action, {
				headers: {
					'Content-Type': 'application/json',
				},
				method: this.method,
				body: JSON.stringify(fetchBody),
			});

			const data = await res.json();

			if (data.status === 'fail' || data.status === 'error')
				throw new Error(data.message);

			showAlert(data.message, 'success');
			if (
				this.form.id === 'login' ||
				this.form.id === 'signup' ||
				this.form.id === 'resetPassword'
			)
				setTimeout(() => (window.location = '/'), ALERT_DURATION);
			if (this.form.dataset.reload)
				setTimeout(() => window.location.reload(), ALERT_DURATION);
		} catch (err) {
			showAlert(err.message, 'error');
		}
	}
}

const forms = [
	'#login',
	'#signup',
	'#resetPassword',
	'#forgotPassword',
	'#form-account',
];
forms.forEach(form => {
	const formElement = document.querySelector(form);
	if (formElement) new Form(formElement);
});
