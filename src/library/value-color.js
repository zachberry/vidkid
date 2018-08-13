const N = require("../web-components/base-node").default;
class ValueColor extends N {
	static get inputs() {
		return [
			{
				name: "value",
				observe: true,
				defaultValue: "#FF0000",
				restrict: String,
				control: N.color()
			}
		];
	}

	static get outputs() {
		return ["value"];
	}

	onAttrChanged(name, oldValue, newValue) {
		this.send("value", newValue);
	}
}

export default {
	label: "Value Color",
	text: ValueColor.toString()
};
