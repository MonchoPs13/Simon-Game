const theme = document.querySelector('.theme');
const themeBtn = document.querySelector('.theme__button');
const labels = document.querySelectorAll('.theme__label');
const tiles = document.querySelectorAll('.simon-game__tile');

theme.addEventListener('input', function (e) {
	const label = e.target.closest('label');
	const tile = tiles[Number(label.dataset.tile)];
	label.style.setProperty('--current-clr', e.target.value);
	const colorRGB = hexToRGB(e.target.value);
	const colorHSL = RGBToHSL(...colorRGB);
	const tileColor = `hsl(${colorHSL[0]}, ${colorHSL[1]}%, ${colorHSL[2]}%)`;
	const tileColorOpaque = `hsl(${colorHSL[0]}, ${colorHSL[1]}%, ${colorHSL[2]}%, 0.4)`;
	tile.style.setProperty('--tile-color', tileColor);
	tile.style.setProperty('--tile-color-opaque', tileColorOpaque);
});

themeBtn.addEventListener('click', function (e) {
	tiles.forEach(tile => {
		tile.style.setProperty('--tile-color', null);
		tile.style.setProperty('--tile-color-opaque', null);
	});

	labels.forEach(label => label.style.setProperty('--current-clr', null));
});

/* Color transformation functions obtained from https://css-tricks.com/converting-color-spaces-in-javascript/ */
function RGBToHSL(r, g, b) {
	// Make r, g, and b fractions of 1
	r /= 255;
	g /= 255;
	b /= 255;

	// Find greatest and smallest channel values
	let cmin = Math.min(r, g, b),
		cmax = Math.max(r, g, b),
		delta = cmax - cmin,
		h = 0,
		s = 0,
		l = 0;

	// Calculate hue
	// No difference
	if (delta == 0) h = 0;
	// Red is max
	else if (cmax == r) h = ((g - b) / delta) % 6;
	// Green is max
	else if (cmax == g) h = (b - r) / delta + 2;
	// Blue is max
	else h = (r - g) / delta + 4;

	h = Math.round(h * 60);

	// Make negative hues positive behind 360°
	if (h < 0) h += 360;

	// Calculate lightness
	l = (cmax + cmin) / 2;

	// Calculate saturation
	s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

	// Multiply l and s by 100
	s = +(s * 100).toFixed(1);
	l = +(l * 100).toFixed(1);

	return [h, s, l];
}

function hexToRGB(h) {
	let r = 0,
		g = 0,
		b = 0;

	// 3 digits
	if (h.length == 4) {
		r = '0x' + h[1] + h[1];
		g = '0x' + h[2] + h[2];
		b = '0x' + h[3] + h[3];

		// 6 digits
	} else if (h.length == 7) {
		r = '0x' + h[1] + h[2];
		g = '0x' + h[3] + h[4];
		b = '0x' + h[5] + h[6];
	}

	return [
		Number.parseInt(r, 16),
		Number.parseInt(g, 16),
		Number.parseInt(b, 16),
	];
}
