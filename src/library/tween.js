const t = `class Tween extends N {
	static get inputs() {
		return [
			{
				name: "in",
				observe: true,
				defaultValue: 0,
				restrict: Number
			},
			{
				name: "time",
				observe: false,
				defaultValue: 1000,
				restrict: Number
			},
			{
				name: "fn",
				observe: false,
				defaultValue: "Quadratic.InOut",
				restrict: N.set(["Linear", "Quadratic.In", "Quadratic.Out", "Quadratic.InOut", "Cubic.In", "Cubic.Out", "Cubic.InOut", "Quartic.In", "Quartic.Out", "Quartic.InOut", "Quintic.In", "Quintic.Out", "Quintic.InOut", "Sinusoidal.In", "Sinusoidal.Out", "Sinusoidal.InOut", "Exponential.In", "Exponential.Out", "Exponential.InOut", "Circular.In", "Circular.Out", "Circular.InOut", "Elastic.In", "Elastic.Out", "Elastic.InOut", "Back.In", "Back.Out", "Back.InOut", "Bounce.In", "Bounce.Out", "Bounce.InOut"])
			}
		];
	}

	static get outputs() {
		return ["out"];
	}

	readyCallback() {
		this.boundOnUpdate = this.onUpdate.bind(this);
	}

	destroyCallback() {
		if (this.tween) this.tween.stop();
	}

	onUpdate() {
		TWEEN.update();
		this.send("out", this.target.v);

		if(this.tween.isPlaying()) window.requestAnimationFrame(this.boundOnUpdate);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name !== "in") return;

		let tweenMethod = this.getAttribute("fn");
		let tokens = tweenMethod ? tweenMethod.split(".") : ["Quadratic", "InOut"];

		this.target = { v: oldValue };
		this.tween = new TWEEN.Tween(this.target)
			.to({ v: newValue }, this.getAttribute("time"))
			.easing(TWEEN.Easing[tokens[0]][tokens[1]])
			.start();
			console.log('tweeeeeen', this.tween, TWEEN)
		window.requestAnimationFrame(this.boundOnUpdate);
	}
}`;

export default {
	label: "Tween",
	text: t
};
