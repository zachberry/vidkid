const N = require("../web-components/base-node").default;
class Send extends N {
	static get inputs() {
		return [
			{
				name: "in",
				restrict: Number,
				defaultValue: 0,
				observe: false
			},
			{
				name: "send",
				control: N.button(),
				observe: true
			}
		];
	}

	static get outputs() {
		return ["out"];
	}

	onAttrChanged(name, oldValue, newValue) {
		this.send("out", this.getAttribute("in"));
	}
}

export default {
	label: "Send",
	text: Send.toString()
};
