const N = require("../web-components/base-node").default;
class Increment extends N {
	static get inputs() {
		return [
			{
				name: "in",
				observe: true,
				control: N.button()
			},
			{
				name: "reset",
				observe: true,
				control: N.button()
			},
			{
				name: "value",
				observe: false,
				defaultValue: 0,
				restrict: Number
			},
			{
				name: "operator",
				observe: false,
				defaultValue: "add",
				restrict: N.set(["add", "multiply", "divide"])
			},
			{
				name: "ascending",
				observe: false,
				defaultValue: true,
				restrict: Boolean
			},
			{
				name: "by-amount",
				observe: false,
				defaultValue: 1,
				restrict: Number
			},
			{
				name: "start",
				observe: false,
				defaultValue: 0,
				restrict: Number
			},
			{
				name: "loop-at-max",
				observe: false,
				defaultValue: false,
				restrict: Boolean
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

	updateAndSendValue() {
		let value = this.getAttribute("value");
		let isAscending = this.getAttribute("ascending");
		let byAmount = this.getAttribute("by-amount");
		let loopAtMax = this.getAttribute("loop-at-max");
		let max = this.getAttribute("max");
		let operator = this.getAttribute("operator");

		if (!isAscending) byAmount *= -1;

		switch (operator) {
			case "add":
				value += byAmount;
				break;

			case "multiply":
				value *= byAmount;
				break;

			case "divide":
				value /= byAmount;
				break;
		}

		if (loopAtMax) {
			if ((isAscending && value > max) || (!isAscending && value < max)) {
				value = this.getAttribute("start");
			}
		}

		this.setAttribute("value", value);
		this.send("out", value);
	}

	onAttrChanged(name, oldValue, newValue) {
		switch (name) {
			case "in":
				this.updateAndSendValue();
				break;

			case "reset":
				this.setAttribute("value", this.getAttribute("start"));
				break;
		}
	}
}

export default {
	label: "Increment",
	text: Increment.toString()
};
