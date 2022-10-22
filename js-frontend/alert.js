import { ALERT_DURATION } from './config.js';

export default function showAlert(msg, type) {
	const alert = `<span class="alert alert--${type}">${msg}</span>`;
	document.body.insertAdjacentHTML('afterbegin', alert);

	setTimeout(() => {
		document.querySelector('.alert').remove();
	}, ALERT_DURATION);
}
