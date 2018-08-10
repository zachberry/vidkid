const N = require("../web-components/base-node").default;
class AnimationFrame extends N {
	static get inputs() {
		return [
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
			}
		];
	}

	static get outputs() {
		return ["pulse"];
	}

	onReady() {
		this.boundOnFrame = this.onFrame.bind(this);
		this.start();
	}

	onDestroy() {
		this.stop();
	}

	start() {
		this.stop();
		this.setIsActive(true);
		this.onFrame();
	}

	stop() {
		this.setIsActive(false);
	}

	onFrame() {
		if (!this.active) return;

		this.send("pulse", true);
		window.requestAnimationFrame(this.boundOnFrame);
	}

	setIsActive(newIsActive) {
		this.active = newIsActive;
		this.setAttribute("active", this.active);
	}

	onAttrChanged(name, oldValue, newValue) {
		switch (name) {
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
	label: "Animation Frame",
	text: AnimationFrame.toString()
};
