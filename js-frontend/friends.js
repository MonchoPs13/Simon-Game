import showAlert from './alert.js';
import { FRIEND_DEBOUNCE_DURATION } from './config.js';

const pendingColumn = document.querySelector('#pending-column');
const friendsForm = document.querySelector('#form-friends');
const searchInput = document.querySelector('.form__search input');
const userContainer = document.querySelector('.form__user-container');
const loadingIcon = document.querySelector('#form-friends .form__loading');

const debounceFriendQuery = debounce(async query => {
	try {
		userContainer.innerHTML = '';
		if (!query) return;
		loadingIcon.classList.remove('hidden');

		const res = await fetch(`/api/v1/users/searchFriend/${query}`);
		const data = await res.json();

		let html = '';
		data.data.users.forEach(user => {
			html += createQueryHTML(user.username);
		});

		loadingIcon.classList.add('hidden');
		userContainer.insertAdjacentHTML('afterbegin', html);
	} catch (err) {
		showAlert(err.message, 'error');
	}
}, FRIEND_DEBOUNCE_DURATION);

pendingColumn?.addEventListener('click', async e => {
	if (!e.target.dataset.addFriend) return;
	const type = e.target.dataset.addFriend;
	const username =
		e.target.parentElement.querySelector('.label__text').textContent;

	await addFriend(username, type);
	e.target.parentElement.remove();
});

searchInput?.addEventListener('input', e => {
	const query = e.target.value;
	debounceFriendQuery(query);
});

friendsForm?.addEventListener('submit', e => {
	e.preventDefault();
	debounceFriendQuery(searchInput.value);
});

userContainer?.addEventListener('click', e => {
	if (!e.target.classList.contains('label__icon')) return;
	const username =
		e.target.parentElement.querySelector('.label__text').textContent;
	sendFriendRequest(username);
});

async function addFriend(username, type) {
	try {
		const res = await fetch(`/api/v1/users/addFriend/${type}/${username}`, {
			method: 'POST',
		});

		const data = await res.json();

		if (data.status !== 'success') throw new Error(data.message);

		showAlert(data.message, 'success');

		if (type === 'deny') return;

		const friendHTML = `
			<div class='label'>
				<svg class='label__icon'>
					<use xlink:href='/img/sprite.svg#user'></use>
				</svg>
				<span class='label__text'>${username}</span>
			</div>
		`;

		document
			.querySelector('#friends-column .label')
			.insertAdjacentHTML('beforebegin', friendHTML);
	} catch (err) {
		showAlert(err.message, 'error');
	}
}

async function sendFriendRequest(username) {
	try {
		const res = await fetch(`/api/v1/users/sendFriendRequest/${username}`, {
			method: 'POST',
		});

		const data = await res.json();
		if (data.status !== 'success') throw new Error(data.message);

		showAlert(data.message, 'success');
	} catch (err) {
		showAlert(err.message, 'error');
	}
}

function debounce(fn, timeout = 1000) {
	let timer;

	return function (...args) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			fn(...args);
		}, timeout);
	};
}

function createQueryHTML(username) {
	return `<div class="label label--add-friend" style="margin-top: 1rem">
		<svg class="label__icon">
			<use xlink:href="./img/sprite.svg#user"></use>
		</svg>
		<span class="label__text">${username}</span>
		<svg class="label__icon" style="--clickable: all">
			<use xlink:href="./img/sprite.svg#add"></use>
		</svg>
	</div>`;
}
