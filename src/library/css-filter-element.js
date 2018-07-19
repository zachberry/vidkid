const t = `class CSSFilterElement extends N {
	static get inputs() {
		return [
			{
				name: "filter-string",
				observe: true,
				defaultValue: "",
				restrict: String
			},
			{
				name: "selector",
				observe: true,
				defaultValue: "body",
				restrict: String
			}
		];
	}

	getEl(selector) {
		try {
			return this.screen.querySelector(selector);
		} catch (e) {
			return null;
		}
	}

	readyCallback() {
		// Called when component is on the DOM
	}

	destroyCallback() {
		// Called when component will be removed from the DOM
	}

	getCSSFilterString(s) {
		return s
			.split("|")
			.map(pair => pair.split(":")[1])
			.join(" ");
	}

	setFilter(selector, filterText) {
		let el = this.getEl(selector);
		if (el) el.style.filter = filterText;
	}

	inputDisconnectedCallback(name) {
		if(name === 'filter-string')
		{
			this.setFilter(this.getAttribute('selector'), '')
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case "selector":
				this.setFilter(oldValue, '');
				this.setFilter(newValue, this.getCSSFilterString(this.getAttribute("filter-string")));
				break;

			case "filter-string":
				this.setFilter(this.getAttribute('selector'), this.getCSSFilterString(newValue));
				break;
		}
	}
}`;

export default {
	label: "CSS Filter Element",
	text: t
};
