import {
	SIMON_GAME_CROSS_DURATION,
	SIMON_GAME_STEP_DURATION,
} from './config.js';

export class SimonGame {
	#startBtn = document.querySelector('.simon-game__inner-circle');
	#simonGameContainer = document.querySelector('.simon-game__outer-circle');
	#simonGameCross = document.querySelector('.simon-game__cross');
	#scoreElement = document.querySelector('.game-score__score');
	#formElement = document.querySelector('#form-play');
	#highscoreLabel = document.querySelector('#highscoreLabel');

	constructor() {
		this.#startBtn.addEventListener('click', this.startGame.bind(this));
		this.#simonGameContainer.addEventListener(
			'click',
			this._tileHandler.bind(this)
		);
		this.tiles = [...document.querySelectorAll('.simon-game__tile')];
		this.audios = this.tiles.map(
			tile => new Audio(`../audios/${tile.dataset.audio}`)
		);
		this.errorAudio = new Audio(`../audios/error.wav`);
		this.volumeBtn = document.querySelector('[data-volume]');

		if (this.#highscoreLabel)
			window.localStorage.setItem(
				'highscore',
				this.#highscoreLabel.textContent
			);

		this._initVariables();
	}

	_initVariables() {
		this.active = false;
		this.running = false;
		this.step = 0;
		this.pattern = [];
		this.score = 0;
	}

	startGame() {
		this.#startBtn.classList.add('simon-game__inner-circle--inactive');
		this.active = true;
		this._startRound();
	}

	_startRound() {
		this.running = true;
		this.step = 0;
		const randomNumber = this._generateRandomNumber();
		this.pattern.push(randomNumber);

		new Promise(resolve => {
			setTimeout(resolve, (this.pattern.length + 1) * SIMON_GAME_STEP_DURATION);

			this.pattern.forEach((tile, i) => {
				setTimeout(
					this._applyStyles.bind(this, tile),
					(i + 1) * SIMON_GAME_STEP_DURATION
				);
			});
		}).then(() => {
			this.running = false;
		});
	}

	_tileHandler(e) {
		if (
			!e.target.classList.contains('simon-game__tile') ||
			this.running ||
			!this.active
		)
			return;

		const tile = Number(e.target.dataset.tile);
		this._checkCurrentStep(tile);
	}

	_checkCurrentStep(tile) {
		if (tile === this.pattern[this.step]) {
			this.step++;
			this._applyStyles(tile, true, true);

			if (this.step === this.pattern.length) {
				this.score++;
				this.#scoreElement.textContent = String(this.score).padStart(2, '0');
				this.running = true;
				setTimeout(this._startRound.bind(this), SIMON_GAME_STEP_DURATION);
			}
		} else this._endGame();
	}

	_endGame() {
		this.#simonGameCross.style.display = 'block';
		this.#scoreElement.textContent = '00';
		if (this.volumeBtn.dataset.volume === 'on') this.errorAudio.play();

		setTimeout(() => {
			this.#simonGameCross.style.display = 'none';
			this.#startBtn.classList.remove('simon-game__inner-circle--inactive');
		}, SIMON_GAME_CROSS_DURATION);
		if (this.score !== 0) this._checkHighscore();
		this._initVariables();
	}

	_checkHighscore() {
		const highscore = window.localStorage.getItem('highscore');

		if (highscore && highscore >= this.score) return;

		window.localStorage.setItem('highscore', this.score);

		if (this.#highscoreLabel)
			highscoreLabel.textContent = `Highscore: ${this.score}`;

		this.#formElement.querySelector('.form__header span').textContent = String(
			this.score
		).padStart(2, '0');

		const userID = document.querySelector('main').dataset.user;
		if (userID !== 'undefined')
			fetch('/api/v1/users/updateUser', {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'PATCH',
				body: JSON.stringify({
					highscore: this.score,
				}),
			})
				.then(data => data.json())
				.then(data => console.log(data));

		this.#formElement.closest('.form-modal').classList.toggle('hidden');
	}

	_applyStyles(tile, correct = true, userClick = false) {
		if (correct) {
			this.tiles.forEach(currentTile => {
				currentTile.classList.add(
					`simon-game__tile--${
						Number(currentTile.dataset.tile) === tile ? 'active' : 'inactive'
					}`
				);

				if (
					Number(currentTile.dataset.tile) === tile &&
					this.volumeBtn.dataset.volume === 'on'
				)
					this.audios
						.find(
							audio =>
								audio.currentSrc.split('/').at(-1) === currentTile.dataset.audio
						)
						.play();
			});
			setTimeout(
				this._removeStyles.bind(this),
				!userClick ? SIMON_GAME_STEP_DURATION - 100 : 200
			);
		}
	}

	_removeStyles() {
		this.tiles.forEach(tile => {
			tile.classList.remove(
				[...tile.classList].find(
					cl =>
						cl === 'simon-game__tile--active' ||
						cl === 'simon-game__tile--inactive'
				)
			);
		});
	}

	_generateRandomNumber() {
		return Math.floor(Math.random() * (5 - 1)) + 1;
	}
}

const playButtons = document.querySelector('.play-buttons');
playButtons.addEventListener('click', function (e) {
	if (!e.target.classList.contains('play-buttons__btn')) return;

	if (e.target.dataset.volume) {
		e.target.dataset.volume = e.target.dataset.volume === 'on' ? 'off' : 'on';
		const useElement = e.target.querySelector('use');
		const currentSvg = useElement.getAttribute('xlink:href');

		useElement.setAttribute(
			'xlink:href',
			currentSvg.includes('up')
				? currentSvg.replace('up', 'off')
				: currentSvg.replace('off', 'up')
		);
	}
});

const playForm = document.querySelector('#form-play');
playForm.addEventListener('submit', function (e) {
	e.preventDefault();

	if (e.submitter.textContent === 'Log In') window.location = '/login';
	else this.closest('.form-modal').classList.toggle('hidden');
});

playForm.addEventListener('click', function (e) {
	if (!e.target.classList.contains('link')) return;
	e.preventDefault();

	this.closest('.form-modal').classList.toggle('hidden');
	document
		.querySelector('.navigation__link[href="#leaderboards-section"]')
		.click();
});
