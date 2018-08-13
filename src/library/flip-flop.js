const N = require("../web-components/base-node").default;
class FlipFlop extends N {
	static get inputs() {
		return [
			{
				name: "in",
				observe: true,
				control: N.button()
			},
			{
				name: "state",
				observe: false,
				restrict: Boolean
			},
			{
				name: "value-1",
				observe: false,
				defaultValue: 0,
				restrict: Number
			},
			{
				name: "value-2",
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
		let v1 = this.getAttribute("value-1");
		let v2 = this.getAttribute("value-2");
		let shouldSendValue2 = this.getAttribute("state");

		this.send("out", shouldSendValue2 ? v2 : v1);

		this.setAttribute("state", !shouldSendValue2);
	}
}

export default {
	label: "Flip Flop",
	text: FlipFlop.toString()
};
