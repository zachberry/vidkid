const N = require("../web-components/base-node").default;
class Abs extends N {
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
		return ["abs"];
	}

	onAttrChanged(name, oldValue, newValue) {
		this.send("abs", Math.abs(this.getAttribute("value")));
	}
}

export default {
	label: "Abs",
	text: Abs.toString()
};
