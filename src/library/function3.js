const N = require("../web-components/base-node").default;
class Function3 extends N {
	static get type() {
		return N.SCREEN;
	}

	static get inputs() {
		return [
			{
				name: "fn",
				observe: true,
				defaultValue: "",
				restrict: String
			},
			{
				name: "x",
				observe: true,
				defaultValue: 0,
				restrict: Number
			},
			{
				name: "y",
				observe: true,
				defaultValue: 0,
				restrict: Number
			},
			{
				name: "z",
				observe: true,
				defaultValue: 0,
				restrict: Number
			}
		];
	}

	static get outputs() {
		return ["out"];
	}

	onReady() {
		this.defaultFn = () => null;
		this.fn = this.defaultFn;
	}

	setFn(fnText) {
		try {
			this.fn = new Function("x", "y", "z", "return (" + fnText + ")");
		} catch (e) {
			this.fn = this.defaultFn;
		}
	}

	onAttrChanged(name, oldValue, newValue) {
		switch (name) {
			case "fn":
				this.setFn(newValue);
				break;

			default:
				this.send(
					"out",
					this.fn(this.getAttribute("x"), this.getAttribute("y"), this.getAttribute("z"))
				);
				break;
		}
	}
}

export default {
	label: "Function3",
	text: Function3.toString()
};
