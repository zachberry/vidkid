const N = require("../web-components/base-node").default;
class RandomNumber extends N {
	static get inputs() {
		return [
			{
				name: "in",
				observe: true,
				control: N.button()
			},
			{
				name: "int",
				observe: false,
				defaultValue: false,
				restrict: Boolean
			},
			{
				name: "min",
				observe: false,
				defaultValue: 0,
				restrict: Number
			},
			{
				name: "max",
				observe: false,
				defaultValue: 1,
				restrict: Number
			}
		];
	}

	static get outputs() {
		return ["out"];
	}

	onAttrChanged(name, oldValue, newValue) {
		let isInt = this.getAttribute("int");
		let min = this.getAttribute("min");
		let max = this.getAttribute("max");

		if (isInt) {
			this.send("out", Math.floor(Math.random() * (max - min + 1)) + min);
		} else {
			this.send("out", Math.random() * (max - min) + min);
		}
	}
}

export default {
	label: "Random Number",
	text: RandomNumber.toString()
};
