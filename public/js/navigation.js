const nav = document.querySelector('.navigation__list');
const sections = document.querySelectorAll('section');
nav.addEventListener('click', pageChange);

function pageChange(e) {
	if (e.target === this) return;
	e.preventDefault();

	const clickedLink = e.target.closest('a');
	document
		.querySelector('.navigation__link--active')
		.classList.remove('navigation__link--active');
	clickedLink.classList.add('navigation__link--active');
	const destinationSection = document.querySelector(
		clickedLink.getAttribute('href')
	);

	const translateValue = Number(destinationSection.dataset.translate);

	sections.forEach(section => {
		const sectionTranslate = Number(section.dataset.translate);
		section.style.translate = `${sectionTranslate - translateValue}%`;
	});
}
