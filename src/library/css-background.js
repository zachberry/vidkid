const N = require("../web-components/base-node").default;
class CSSBackground extends N {
	static get type() {
		return N.SCREEN;
	}

	static get inputs() {
		return [
			{
				name: "selector",
				observe: true,
				defaultValue: "body",
				restrict: String
			},
			{
				name: "data-url",
				observe: true,
				defaultValue: "",
				restrict: String
			},
			{
				name: "position-x",
				observe: true,
				defaultValue: 0,
				restrict: Number,
				control: N.range({ min: -1000, max: 1000 })
			},
			{
				name: "position-y",
				observe: true,
				defaultValue: 0,
				restrict: Number,
				control: N.range({ min: -1000, max: 1000 })
			},
			{
				name: "size",
				observe: true,
				defaultValue: 100,
				restrict: N.float(0.01),
				control: N.range({ min: 0.01, max: 1000 })
			}
		];
	}

	getElFromSelector(s) {
		try {
			let el = this.screen.querySelector(s);
			if (!el) return null;
			return el;
		} catch (e) {
			return null;
		}
	}

	updateEl() {
		if (!this.el) return;

		let dataURL = this.getAttribute("data-url");
		this.el.style.backgroundPositionX = this.getAttribute("position-x") + "px";
		this.el.style.backgroundPositionY = this.getAttribute("position-y") + "px";
		this.el.style.backgroundSize = this.getAttribute("size") + "%";
		if (dataURL && dataURL.length) this.el.style.backgroundImage = `url(${dataURL})`;
	}

	onAttrChanged(name, oldValue, newValue) {
		switch (name) {
			case "selector":
				this.el = this.getElFromSelector(newValue);
				this.updateEl();
				break;

			case "data-url":
				if (!this.el) return;
				if (newValue && newValue.length) this.el.style.backgroundImage = `url(${newValue})`;
				break;

			case "position-x":
				if (!this.el) return;
				this.el.style.backgroundPositionX = newValue + "px";
				break;

			case "position-y":
				if (!this.el) return;
				this.el.style.backgroundPositionY = newValue + "px";
				break;

			case "size":
				if (!this.el) return;
				this.el.style.backgroundSize = newValue + "%";
				break;
		}
	}
}

export default {
	label: "CSS Background",
	text: CSSBackground.toString()
};
