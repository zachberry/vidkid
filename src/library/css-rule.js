const N = require("../web-components/base-node").default;
class CSSRule extends N {
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
				name: "css-rule",
				observe: true,
				defaultValue: "",
				restrict: String
			},
			{
				name: "css-value",
				observe: true,
				defaultValue: "",
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

	setRule(el, name, value) {
		if (!this.el) return;

		try {
			this.el.style[name] = value;
		} catch (e) {
			// Do nothing
		}
	}

	onReady() {
		this.el = null;
	}

	onScreenUpdated() {
		this.el = this.getEl(this.getAttribute("selector"));
		this.setRule(this.el, this.getAttribute("css-rule"), this.getAttribute("css-value"));
	}

	onRemove() {
		this.setRule(this.el, this.getAttribute("css-rule"), "");
	}

	onAttrChanged(name, oldValue, newValue) {
		switch (name) {
			case "selector":
				// Clear out old rule:
				this.setRule(this.el, this.getAttribute("css-rule"), "");
				this.el = this.getEl(newValue);
				break;

			case "css-rule":
				// Clear out old rule:
				this.setRule(this.el, oldValue, "");
			default:
				this.setRule(this.el, this.getAttribute("css-rule"), this.getAttribute("css-value"));
				break;
		}
	}
}

export default {
	label: "CSS Rule",
	text: CSSRule.toString()
};
