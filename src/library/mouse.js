const t = `class Mouse extends N {
	static get inputs() {
		return [
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
			}
		];
	}

	static get outputs() {
		return ["x", "y", "x%", "y%"];
	}

	onMouseMove(event) {
		this.setAttribute("x", event.clientX);
		this.setAttribute("y", event.clientY);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case "x":
				this.send("x", newValue);
				this.send("x%", newValue / window.innerWidth);
				break;

			case "y":
				this.send("y", newValue);
				this.send("y%", newValue / window.innerHeight);
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
}`;

export default {
	label: "Mouse",
	text: t
};
