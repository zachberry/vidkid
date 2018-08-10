const N = require("../web-components/base-node").default;
class Pulse extends N {
	static get inputs() {
		return [
			{
				name: "time",
				observe: true,
				defaultValue: 1000,
				restrict: N.int(1)
			},
			{
				name: "start",
				observe: true,
				control: N.button()
			},
			{
				name: "stop",
				observe: true,
				control: N.button()
			},
			{
				name: "active",
				observe: true,
				defaultValue: true,
				restrict: Boolean
			},
			{
				name: "reset",
				observe: true,
				control: N.button()
			}
		];
	}

	static get outputs() {
		return ["pulse"];
	}

	onReady() {
		this.boundOnTick = this.onTick.bind(this);
		this.start();
	}

	onDestroy() {
		this.stop();
	}

	start() {
		this.stop();
		this.setIsActive(true);
		this.intervalId = setInterval(this.boundOnTick, this.getAttribute("time"));
	}

	stop() {
		this.setIsActive(false);
		clearInterval(this.intervalId);
	}

	onTick() {
		this.send("pulse", true);
	}

	setIsActive(newIsActive) {
		this.active = newIsActive;
		this.setAttribute("active", this.active);
	}

	onAttrChanged(name, oldValue, newValue) {
		switch (name) {
			case "time":
				this.start();
				break;

			case "reset":
				this.start();
				break;

			case "start":
				this.start();
				break;

			case "stop":
				this.stop();
				break;

			case "active":
				let nextActive = this.getAttribute("active");
				if (this.active === nextActive) return;

				if (nextActive) {
					this.start();
				} else {
					this.stop();
				}
				break;
		}
	}
}

export default {
	label: "Pulse",
	text: Pulse.toString()
};
