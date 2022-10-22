export class Navigation {
	#navElement = document.querySelector('.navigation__list');
	#sections = document.querySelectorAll('.section');

	constructor() {
		this.#navElement.addEventListener('click', this._pageChange.bind(this));
		this.currentLink = document.querySelector('.navigation__link--active');
		this.currentSection = document.querySelector(
			this.currentLink.getAttribute('href')
		);
		document.addEventListener('touchstart', this._touchStart.bind(this));
		document.addEventListener('touchmove', this._touchMove.bind(this));
		['touchend', 'touchcancel'].forEach(event =>
			document.addEventListener(event, this._touchEnd.bind(this))
		);
	}

	_pageChange(e) {
		if (e.target === this.#navElement) return;
		e.preventDefault();

		const clickedLink = e.target.closest('a');
		this.currentLink.classList.remove('navigation__link--active');
		clickedLink.classList.add('navigation__link--active');
		this.currentLink = clickedLink;

		const clickedSection = document.querySelector(
			clickedLink.getAttribute('href')
		);
		this.currentSection = clickedSection;
		const translateValue = Number(clickedSection.dataset.translate);

		this.#sections.forEach(section => {
			const sectionTranslate = Number(section.dataset.translate);
			section.dataset.translate = sectionTranslate - translateValue;
			section.style.translate = `${sectionTranslate - translateValue}%`;
		});
	}

	_touchStart(e) {
		this.startX = e.touches[0].clientX;
		this.#sections.forEach(section => (section.style.transition = 'none'));
	}

	_touchMove(e) {
		const movedPixels = Math.round(e.touches[0].clientX - this.startX);
		const bodyWidth = Number.parseInt(getComputedStyle(document.body).width);
		const movedPercentage = Math.round((movedPixels * 100) / bodyWidth);

		if (this.currentSection.id === 'theme-section' && movedPercentage > 0)
			return;
		if (this.currentSection.id === 'friends-section' && movedPercentage < 0)
			return;

		this.#sections.forEach(section => {
			section.style.translate = `${
				Number(section.dataset.translate) + movedPercentage
			}%`;
		});
	}

	_touchEnd() {
		this.#sections.forEach(section => {
			section.style.transition = 'translate 0.5s';
			const currentTranslate =
				Number.parseInt(section.style.translate) || section.dataset.translate;
			const finalTranslate = Math.round(currentTranslate / 100) * 100;

			section.style.translate = `${finalTranslate}%`;
			section.dataset.translate = finalTranslate;
		});

		this.currentSection = document.querySelector(`[data-translate="0"]`);
		this.currentLink.classList.remove('navigation__link--active');
		this.currentLink = document.querySelector(
			`a[href="#${this.currentSection.id}"]`
		);
		this.currentLink.classList.add('navigation__link--active');

		this.startX = 0;
	}
}
