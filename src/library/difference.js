const N = require("../web-components/base-node").default;
class Difference extends N {
	static get inputs() {
		return [
			{
				name: "a",
				restrict: Number,
				defaultValue: 0,
				observe: true
			},
			{
				name: "b",
				restrict: Number,
				defaultValue: 0,
				observe: true
			}
		];
	}

	static get outputs() {
		return ["a - b", "b - a", "comparision"];
	}

	onAttrChanged(name, oldValue, newValue) {
		let a = parseFloat(this.getAttribute("a"));
		let b = parseFloat(this.getAttribute("b"));
		let c = 0;

		if (a > b) c = 1;
		if (a < b) c = -1;

		this.send("a - b", a - b);
		this.send("b - a", b - a);
		this.send("comparision", c);
	}
}

export default {
	label: "Difference",
	text: Difference.toString()
};
