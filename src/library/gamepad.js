const c = `class Gamepad extends N {
	static get type() { return N.HARDWARE };

	static get inputs() {
		return [
			{
				name: "gamepad-num",
				observe: true,
				defaultValue: 0,
				restrict: Number,
				visible: false
			}
		];
	}

	static get outputs() {
		return ["axis-1", "axis-2", "axis-3", "axis-4", "button-1", "button-2", "button-3", "button-4"];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		console.log("ACC", name, oldValue, newValue);
		//this.setInput(newValue);
		this.updateList();
		console.log(this.gamepads);
	}

	updateList() {
		//if (!this.select || !this.gamepads) return;

		while (this.select.children.length > 0) {
			this.select.removeChild(this.select.children[0]);
		}

		let gamepads = navigator.getGamepads();

		for(let i = 0, len = gamepads.length; i < len; i++) {
			let gamepad = gamepads[i];
			let option = document.createElement("option");

			if(gamepad === null)
			{
				option.innerText = '--';
			}
			else
			{
				option.innerText = gamepad.id;

			}

			option.value = i;

			this.select.appendChild(option);
		}

		this.select.value = this.getAttribute("gamepad-num");
	}

	updateGamepads() {
		// let existingGamepads = navigator.getGamepads();
		// this.gamepads = [];

		// for (let i = 0, len = existingGamepads.length; i < len; i++) {
		// 	let gamepad = existingGamepads[i];
		// 	if (gamepad && gamepad.id) {
		// 		this.gamepads.push(gamepad);
		// 	}
		// }

		// this.updateList();

		// if (this.getAttribute("gamepad-num") === "") {
		// 	this.setAttribute("gamepad-num", this.gamepads[0].id);
		// }

		this.updateList();
	}

	onGamepadConnected(event) {
		this.updateGamepads();
	}

	onGamepadDisconnected(event) {
		if (event.gamepad.id === this.getAttribute("gamepad-num")) {
			this.setAttribute("gamepad-num", "");
		}

		this.updateGamepads();
	}

	poll() {
		if(!this.active) return

		let gamepad = navigator.getGamepads()[this.getAttribute('gamepad-num')]

		if(gamepad) {
			if(!this.lastValues)
			{
				this.lastValues = {
					ax0: null,
					ax1: null,
					ax2: null,
					ax3: null,
					btn0: null,
					btn1: null,
					btn2: null,
					btn3: null
				}
			}

			let ax0 = gamepad.axes[0]
			let ax1 = gamepad.axes[1]
			let ax2 = gamepad.axes[2]
			let ax3 = gamepad.axes[3]
			let btn0 = gamepad.buttons[0] ? gamepad.buttons[0].value : null
			let btn1 = gamepad.buttons[1] ? gamepad.buttons[1].value : null
			let btn2 = gamepad.buttons[2] ? gamepad.buttons[2].value : null
			let btn3 = gamepad.buttons[3] ? gamepad.buttons[3].value : null

			if((ax0 || ax0 === 0) && this.lastValues.ax0 !== ax0) this.send('axis-1', ax0)
			if((ax1 || ax1 === 0) && this.lastValues.ax1 !== ax1) this.send('axis-2', ax1)
			if((ax2 || ax2 === 0) && this.lastValues.ax2 !== ax2) this.send('axis-3', ax2)
			if((ax3 || ax3 === 0) && this.lastValues.ax3 !== ax3) this.send('axis-4', ax3)
			if((btn0 || btn0 === 0) && this.lastValues.btn0 !== btn0) this.send('button-1', btn0)
			if((btn1 || btn1 === 0) && this.lastValues.btn1 !== btn1) this.send('button-2', btn1)
			if((btn2 || btn2 === 0) && this.lastValues.btn2 !== btn2) this.send('button-3', btn2)
			if((btn3 || btn3 === 0) && this.lastValues.btn3 !== btn3) this.send('button-4', btn3)

			this.lastValues = {
				ax0,
				ax1,
				ax2,
				ax3,
				btn0,
				btn1,
				btn2,
				btn3
			}
		}

		window.requestAnimationFrame(this.boundPoll);
	}

	readyCallback() {
		console.log("GP READY!");
		this.active = true;
		this.gamepads = [];
		this.lastValues = {};
		this.selectedGamepad = null;
		this.select = this.root.getElementById("select");
		this.select.addEventListener("change", event => {
			this.setAttribute("gamepad-num", event.target.value);
		});

		this.updateGamepads();

		this.boundOnGamepadConnected = this.onGamepadConnected.bind(this);
		this.boundOnGamepadDisconnected = this.onGamepadDisconnected.bind(this);
		window.addEventListener("gamepadconnected", this.boundOnGamepadConnected);
		window.addEventListener("gamepaddisconnected", this.boundOnGamepadDisconnected);

		// Force listener to listen:
		//this.setInput(this.getAttribute('device-id'));

		//@TODO: Move this
		this.boundPoll = this.poll.bind(this)
		window.requestAnimationFrame(this.boundPoll)
	}

	destroyCallback() {
		this.active = false;
		window.removeEventListener("gamepadconnected", this.boundOnGamepadConnected);
		window.removeEventListener("gamepaddisconnected", this.boundOnGamepadDisconnected);
	}
}`;

const t = `<div id="container">
	<select id="select"></select>
</div>`;

const css = `#container {
	width: 13em;
}

#select {
	width: 100%;
}`;

export default {
	label: "Gamepad",
	text: c,
	templateHTML: t,
	templateCSS: css
};
