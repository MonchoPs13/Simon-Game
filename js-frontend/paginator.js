class Paginator {
	constructor(toggle, container, pageSize) {
		this.toggle = toggle;
		this.container = container;
		this.pageSize = pageSize;
		this.currentPage = 1;
		if (!this.toggle || !this.container) return;
		this.toggle.addEventListener('click', this._pageChange.bind(this));

		this._init();
	}

	_init() {
		this.list = JSON.parse(this.container.dataset.list);
		this.pageCount = Math.ceil(this.list.length / this.pageSize);
		this._updateLabelStyles();
	}

	_pageChange(e) {
		if (!e.target.dataset.to) return;

		const direction = e.target.dataset.to;
		this.currentPage += direction === 'left' ? -1 : 1;
		this._updateLabelStyles();
		this._updateMarkup();
	}

	_updateMarkup() {
		const startIndex = (this.currentPage - 1) * this.pageSize;
		const html = this._generateMarkup(startIndex);
		this.container.innerHTML = '';
		this.container.insertAdjacentHTML('afterbegin', html);
	}

	_updateLabelStyles() {
		const arrowLeft = this.toggle.querySelector(`.label__icon[data-to="left"]`);
		const arrowRight = this.toggle.querySelector(
			`.label__icon[data-to="right"]`
		);

		if (this.currentPage === 1) arrowLeft.classList.add('inactive');
		if (this.currentPage === 2) arrowLeft.classList.remove('inactive');
		if (!this.list || !this.list[this.currentPage * this.pageSize])
			arrowRight.classList.add('inactive');
		else arrowRight.classList.remove('inactive');

		this.toggle.querySelector('.label__text').textContent = `${
			this.currentPage
		} / ${this.pageCount || 1}`;
	}
}

export class FriendsPaginator extends Paginator {
	constructor(toggle, container, pageSize) {
		super(toggle, container, pageSize);
	}

	_generateMarkup(startIndex) {
		let html = '';

		for (let i = startIndex; i < this.pageSize + startIndex; i++) {
			if (!this.list[i]) break;
			html += `
				<div class='label'>
					<svg class='label__icon'>
						<use xlink:href='/img/sprite.svg#user'></use>
					</svg>
					<span class='label__text'>${this.list[i]}</span>
				</div>
			`;
		}

		return html;
	}
}

export class PendingPaginator extends Paginator {
	constructor(toggle, container, pageSize) {
		super(toggle, container, pageSize);
	}

	_generateMarkup(startIndex) {
		let html = '';

		for (let i = startIndex; i < this.pageSize + startIndex; i++) {
			if (!this.list[i]) break;
			html += `
				<div class='label'>
					<svg class='label__icon'>
						<use xlink:href='/img/sprite.svg#user'></use>
					</svg>
					<span class='label__text'>${this.list[i]}</span>
				</div>
				<svg class='label__icon' style='--clickable: all' data-add-friend='accept'>
					<use xlink:href='/img/sprite.svg#checkmark-outline'></use>
				</svg>
				<svg class='label__icon' style='--clickable: all' data-add-friend='deny'>
					<use xlink:href='/img/sprite.svg#close-outline'></use>
				</svg>
			`;
		}

		return html;
	}
}

class LeaderboardsPaginator extends Paginator {
	constructor(toggle, container, pageSize, modeSwitch) {
		super(toggle, container, pageSize);

		this.modeSwitch = modeSwitch;
		this.modeSwitch.addEventListener('click', this._switchMode.bind(this));
	}

	async _init() {
		this.mode = this.mode || 'global';
		this.currentPage = 1;
		await this._getList();
		this.pageCount = Math.ceil(this.list?.length / this.pageSize);
		this._updateLabelStyles();

		if (!this.list) return;
		this._updateMarkup();
	}

	async _getList() {
		try {
			const res = await fetch(`/api/v1/users/leaderboards/${this.mode}`);
			const data = await res.json();

			if (data.status === 'fail' || data.status === 'error')
				throw new Error(data.message);

			this.list = data.data.users;
		} catch (err) {
			this.list = this.container.innerHTML = '';
			const html = `
				<div style='color: var(--clr-red); text-align: center; margin-bottom: 1rem'>${err.message}</div>
			`;
			this.container.insertAdjacentHTML('afterbegin', html);
		}
	}

	_generateMarkup(startIndex) {
		let html = '';

		for (let i = startIndex; i < startIndex + this.pageSize; i++) {
			if (!this.list[i]) break;
			let position;

			if ([0, 1, 2].includes(i)) {
				const trophies = ['yellow', 'silver', 'bronze'];

				position = `
					<svg class='label__icon' style='fill: var(--clr-${trophies[i]})'>
						<use xlink:href='/img/sprite.svg#trophy'></use>
					</svg>
				`;
			} else {
				position = `
					<span class='label__text'>${i + 1}°</span>
				`;
			}

			html += `
				<div class='label'>
					${position}
					<span class='label__text'>${this.list[i].username}</span>
					<span class='label__text'>${this.list[i].highscore}</span>
				</div>
			`;
		}

		return html;
	}

	_switchMode(e) {
		if (!e.target.classList.contains('leaderboard-type__option')) return;

		const [globalOption, friendsOption] = [
			...this.modeSwitch.querySelectorAll('.leaderboard-type__option'),
		];

		globalOption.classList.toggle('leaderboard-type__option--inactive');
		friendsOption.classList.toggle('leaderboard-type__option--inactive');

		this.mode = e.target.textContent.toLowerCase();
		this._init();
	}
}

new FriendsPaginator(
	document.querySelector('#friends-paginator'),
	document.querySelector('#friends-container'),
	5
);

new PendingPaginator(
	document.querySelector('#pending-paginator'),
	document.querySelector('#pending-container'),
	5
);

new LeaderboardsPaginator(
	document.querySelector('#leaderboards-paginator'),
	document.querySelector('.leaderboard'),
	9,
	document.querySelector('.leaderboard-type')
);
