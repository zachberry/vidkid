const N = require("../web-components/base-node").default;
class ConditionalSend extends N {
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
				defaultValue: "x >= 1",
				restrict: String
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
			this.testFn = x => x >= 1;
		}
	}

	onAttrChanged(name, oldValue, newValue) {
		switch (name) {
			case "in":
			case "fn":
				this.updateTestFn();

				let value = this.getAttribute("in");
				if (this.testFn(value)) {
					this.send("out", value);
				}

				break;
		}
	}
}

export default {
	label: "Conditional Send",
	text: ConditionalSend.toString()
};
