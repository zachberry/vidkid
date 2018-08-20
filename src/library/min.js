const N = require("../web-components/base-node").default;
class Min extends N {
	static get inputs() {
		return [
			{
				name: "value",
				observe: true,
				defaultValue: Infinity,
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
		return ["min"];
	}

	onReady() {
		this.min = Infinity;
	}

	onAttrChanged(name, oldValue, newValue) {
		switch (name) {
			case "value":
				let value = this.getAttribute("value");
				if (value === null) return;

				this.min = Math.min(this.min, value);
				this.send("min", this.min);
				break;

			case "reset":
				this.min = Infinity;
				break;
		}
	}
}

export default {
	label: "Min",
	text: Min.toString()
};
