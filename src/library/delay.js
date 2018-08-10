const N = require("../web-components/base-node").default;
class Delay extends N {
	static get inputs() {
		return [
			{
				name: "in",
				observe: true,
				defaultValue: null,
				restrict: null,
				control: N.button()
			},
			{
				name: "delay",
				observe: false,
				defaultValue: 200,
				restrict: N.int(0),
				control: N.range({ min: 0, max: 10000, step: 10 })
			}
		];
	}

	static get outputs() {
		return ["out"];
	}

	onDestroy() {
		window.clearTimeout(this.timeoutId);
	}

	onAttrChanged(name, oldValue, newValue) {
		let delay = this.getAttribute("delay");
		let out = this.getAttribute("in");

		this.timeoutId = setTimeout(() => {
			this.send("out", out);
		}, delay);
	}
}

export default {
	label: "Delay",
	text: Delay.toString()
};
