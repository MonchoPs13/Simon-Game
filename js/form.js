const formToggles = document.querySelectorAll('[data-form-toggle]');
const formModals = document.querySelectorAll('.form-modal');
const formCloses = document.querySelectorAll('.form__close');

[...formModals, ...formCloses].forEach(element =>
	element.addEventListener('click', hideForm)
);

formToggles.forEach(toggle => toggle.addEventListener('click', showForm));

function showForm() {
	const form = document.querySelector(`#form-${this.dataset.formToggle}`);
	form.closest('.form-modal').classList.remove('hidden');
}

function hideForm(e) {
	if (
		!e.target.classList.contains('form-modal') &&
		!e.target.classList.contains('form__close')
	)
		return;
	e.target.closest('.form-modal').classList.add('hidden');
}
