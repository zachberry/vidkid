const t = `class CSSTransformElement extends N {
	static get inputs() {
		return [
			{
				name: "transform-string",
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

	getCSSTransformString(s) {
		return s
			.split("|")
			.map(pair => pair.split(":")[1])
			.join(" ");
	}

	setTransform(selector, transformText) {
		let el = this.getEl(selector);
		if (el) el.style.transform = transformText;
	}

	inputDisconnectedCallback(name) {
		if(name === 'transform-string')
		{
			this.setTransform(this.getAttribute('selector'), '')
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case "selector":
				this.setTransform(oldValue, '');
				this.setTransform(newValue, this.getCSSTransformString(this.getAttribute("transform-string")));
				break;

			case "transform-string":
				this.setTransform(this.getAttribute('selector'), this.getCSSTransformString(newValue));
				break;
		}
	}
}`;

export default {
	label: "CSS Transform Element",
	text: t
};
