const N = require("../web-components/base-node").default;
class Mouse extends N {
	static get type() {
		return N.HARDWARE;
	}

	static get inputs() {
		return [
			{
				name: "x",
				observe: true,
				defaultValue: 0,
				restrict: Number,
				visible: false
			},
			{
				name: "y",
				observe: true,
				defaultValue: 0,
				restrict: Number,
				visible: false
			}
		];
	}

	static get outputs() {
		return ["x", "y", "x%", "y%", "dx", "dy"];
	}

	onMouseMove(event) {
		this.setAttribute("x", event.clientX);
		this.setAttribute("y", event.clientY);
	}

	onAttrChanged(name, oldValue, newValue) {
		switch (name) {
			case "x":
				this.send("x", newValue);
				this.send("x%", newValue / window.innerWidth);
				this.send("dx", parseInt(newValue, 10) - (parseInt(oldValue, 10) || 0));
				break;

			case "y":
				this.send("y", newValue);
				this.send("y%", newValue / window.innerHeight);
				this.send("dy", parseInt(newValue, 10) - (parseInt(oldValue, 10) || 0));
				break;
		}
	}

	connectedCallback() {
		this.boundOnMouseMove = this.onMouseMove.bind(this);
		document.addEventListener("mousemove", this.boundOnMouseMove);
	}

	disconnectedCallback() {
		document.removeEventListener("mousemove", this.boundOnMouseMove);
	}
}

export default {
	label: "Mouse",
	text: Mouse.toString()
};
