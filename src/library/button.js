const t = `class Button extends N {
	static get type() { return N.HARDWARE };

	static get outputs() {
		return ["trigger"];
	}

	onClick() {
		this.send('trigger', true);
	}

	onReady() {
		this.boundOnClick = this.onClick.bind(this)
		this.root.getElementById('button').addEventListener('click', this.boundOnClick)
	}

	onDestroy() {
		this.root.getElementById('button').removeEventListener('click', this.boundOnClick);
	}
}`;

const template = `<button id="button">Click</button>`;

const css = `button {
	font-size: 13pt;
	width: 100%;
	border-radius: 4px;
	border: none;
	cursor: pointer;
	opacity: 0.8;
}

button:hover {
	opacity: 1;
}`;

export default {
	label: "Button",
	text: t,
	templateHTML: template,
	templateCSS: css
};
