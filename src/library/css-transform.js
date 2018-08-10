const N = require("../web-components/base-node").default;
class CSSTransform extends N {
	static get inputs() {
		return [
			{
				name: "chain-id",
				observe: true,
				defaultValue: "",
				restrict: String
			},
			{
				name: "type",
				observe: true,
				defaultValue: "rotate",
				restrict: N.set(["rotate", "translateX", "translateY", "scale", "scaleX", "scaleY"])
			},
			{
				name: "amount",
				observe: true,
				defaultValue: 0,
				restrict: Number
			}
		];
	}

	static get outputs() {
		return ["chain-id"];
	}

	getCSSRule(type, amount) {
		switch (type) {
			case "rotate":
				return "rotate(" + amount + "deg)";
			case "scale":
				return "scale(" + amount + ")";
			case "scaleX":
				return "scaleX(" + amount + ")";
			case "scaleY":
				return "scaleY(" + amount + ")";
			case "translateX":
				return "translateX(" + amount + "%)";
			case "translateY":
				return "translateY(" + amount + "%)";
			default:
				return null;
		}
	}

	onInputDisconnected(name) {
		if (name === "chain-id") {
			this.releaseChain(this.getAttribute("chain-id"));
			this.setAttribute("chain-id", "");
		}
	}

	onAttrChanged(name, oldValue, newValue) {
		let rule = this.getCSSRule(this.getAttribute("type"), this.getAttribute("amount"));
		if (!rule) return;

		let chain = this.getChain(this.getAttribute("chain-id"));
		chain.set(this.id, rule);

		this.send("chain-id", chain.id);
	}

	onDestroy() {
		this.releaseChain(this.getAttribute("chain-id"));
	}
}

export default {
	label: "CSS Transform",
	text: CSSTransform.toString()
};
