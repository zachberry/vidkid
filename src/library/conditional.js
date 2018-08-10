const N = require("../web-components/base-node").default;
class Conditional extends N {
	static get inputs() {
		return [
			{
				name: "in",
				observe: true,
				defaultValue: 0,
				restrict: Number
			},
			{
				name: "fn",
				observe: true,
				defaultValue: "x > 0",
				restrict: String
			},
			{
				name: "when-true",
				observe: false,
				defaultValue: 1,
				restrict: Number
			},
			{
				name: "when-false",
				observe: false,
				defaultValue: 0,
				restrict: Number
			}
		];
	}

	static get outputs() {
		return ["out"];
	}

	onReady() {
		this.updateTestFn();
	}

	updateTestFn() {
		try {
			this.testFn = new Function("x", "return " + this.getAttribute("fn"));
			return;
		} catch (e) {
			this.testFn = x => x > 0;
		}
	}

	onAttrChanged(name, oldValue, newValue) {
		switch (name) {
			case "in":
			case "fn":
				this.updateTestFn();

				if (this.testFn(this.getAttribute("in"))) {
					this.send("out", this.getAttribute("when-true"));
				} else {
					this.send("out", this.getAttribute("when-false"));
				}

				break;
		}
	}
}

export default {
	label: "Conditional",
	text: Conditional.toString()
};
