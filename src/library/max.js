const N = require("../web-components/base-node").default;
class Max extends N {
	static get inputs() {
		return [
			{
				name: "value",
				observe: true,
				defaultValue: -Infinity,
				restrict: Number
			},
			{
				name: "reset",
				observe: true,
				control: N.button()
			}
		];
	}

	static get outputs() {
		return ["max"];
	}

	onReady() {
		this.max = -Infinity;
	}

	onAttrChanged(name, oldValue, newValue) {
		switch (name) {
			case "value":
				let value = this.getAttribute("value");
				if (value === null) return;

				this.max = Math.max(this.max, value);
				this.send("max", this.max);
				break;

			case "reset":
				this.max = -Infinity;
				break;
		}
	}
}

export default {
	label: "Max",
	text: Max.toString()
};
