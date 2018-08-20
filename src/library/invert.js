const N = require("../web-components/base-node").default;
class Invert extends N {
	static get inputs() {
		return [
			{
				name: "value",
				observe: true,
				defaultValue: 0,
				restrict: Number
			}
		];
	}

	static get outputs() {
		return ["inv"];
	}

	onAttrChanged(name, oldValue, newValue) {
		this.send("inv", -1 * this.getAttribute("value"));
	}
}

export default {
	label: "Invert",
	text: Invert.toString()
};
