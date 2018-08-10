const N = require("../web-components/base-node").default;
class CSSTransformElement extends N {
	static get type() {
		return N.SCREEN;
	}

	static get inputs() {
		return [
			{
				name: "chain-id",
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

	setTransform(selector, transformText) {
		let el = this.getEl(selector);
		if (el) el.style.transform = transformText;
	}

	onInputDisconnected(name) {
		if (name === "chain-id") {
			this.setAttribute("chain-id", "");
		}
	}

	getCSSTransformString(chainId) {
		let chain = this.getChain(chainId);
		if (!chain) return "";

		return chain.get().join(" ");
	}

	onAttrChanged(name, oldValue, newValue) {
		switch (name) {
			case "selector":
				this.setTransform(oldValue, "");
				this.setTransform(newValue, this.getCSSTransformString(this.getAttribute("chain-id")));
				break;

			case "chain-id":
				this.setTransform(this.getAttribute("selector"), this.getCSSTransformString(newValue));
				break;
		}
	}
}

export default {
	label: "CSS Transform Element",
	text: CSSTransformElement.toString()
};
