const N = require("../web-components/base-node").default;
class MIDIDevice extends N {
	static get type() {
		return N.HARDWARE;
	}

	static get inputs() {
		return [
			{
				name: "device-id",
				observe: true,
				defaultValue: "",
				restrict: String,
				visible: false
			},
			{
				name: "channel",
				observe: false,
				defaultValue: 0,
				restrict: N.int(0, 16),
				control: N.range()
			},
			{
				name: "message",
				observe: false,
				defaultValue: false,
				restrict: Boolean
			},
			{
				name: "realtime",
				observe: false,
				defaultValue: false,
				restrict: Boolean
			},
			{
				name: "beat",
				observe: false,
				defaultValue: "quarter note",
				restrict: N.set(["24ppqn", "quarter note", "bar", "4 bars"])
			},
			{
				name: "note-on",
				observe: false,
				defaultValue: false,
				restrict: Boolean
			},
			{
				name: "note-off",
				observe: false,
				defaultValue: false,
				restrict: Boolean
			},
			{
				name: "cc",
				observe: false,
				defaultValue: false,
				restrict: Boolean
			},
			{
				name: "zero-as-off",
				observe: false,
				defaultValue: true,
				restrict: Boolean
			}
		];
	}

	static get outputs() {
		return ["message", "start", "stop", "continue", "clock", "note-on", "note-off", "cc", "bpm"];
	}

	constructor() {
		super();
	}

	setInput(id) {
		console.log("SET INPUT", id);
		if (!this.inputs) return;

		this.removeMIDIListeners();

		if (id !== "") {
			let input = this.inputs.get(id);
			if (input) {
				input.addEventListener("midimessage", this.boundOnMIDIMessage);
			}
		}

		this.root.getElementById("select").value = id;
	}

	onAttrChanged(name, oldValue, newValue) {
		console.log("ACC", name, oldValue, newValue);
		this.setInput(newValue);
	}

	removeMIDIListeners() {
		if (!this.inputs) return;
		for (let input of this.inputs.values()) {
			input.removeEventListener("midimessage", this.boundOnMIDIMessage);
		}
	}

	onMIDIMessage(event) {
		let data = Array.from(event.data);
		let channel = this.getAttribute("channel");
		let allowMessage = this.getAttribute("message");
		let allowRealTime = this.getAttribute("realtime");
		let allowNoteOn = this.getAttribute("note-on");
		let allowNoteOff = this.getAttribute("note-off");
		let allowCC = this.getAttribute("cc");
		let transformNoteOnVelocityZeroAsNoteOff = this.getAttribute("zero-as-off");
		let sendClockPerBeat = this.getAttribute("beat");

		if (allowMessage) this.send("message", data);

		//// console.log('got midi', data, channel, allowRealTime, allowNoteOn, allowNoteOff, allowCC)

		// Clock:
		if (data[0] === 0xfa && allowRealTime) {
			//start
			this.sendClock = true;
			this.clock = 0;
			return this.send("start", data);
		}
		if (data[0] === 0xfc && allowRealTime) {
			//stop
			this.sendClock = false;
			this.clock = 0;
			return this.send("stop", data);
		}
		if (data[0] === 0xfb && allowRealTime) {
			//continue
			return this.send("continue", data);
		}
		if (data[0] === 0xf8 && allowRealTime && this.sendClock) {
			if (this.clock % 24 === 0) {
				let now = Date.now();
				if (this.lastClock) this.send("bpm", 60000 / (now - this.lastClock));
				this.lastClock = now;
			}

			let shouldSendBeat = false;
			switch (sendClockPerBeat) {
				case "24ppqn":
					shouldSendBeat = true;
					break;

				case "quarter note":
					shouldSendBeat = this.clock % 24 === 0;
					break;

				case "bar":
					shouldSendBeat = this.clock % 96 === 0;
					break;

				case "4 bars":
					shouldSendBeat = this.clock === 0;
					break;
			}

			if (shouldSendBeat) this.send("clock", data);
			this.clock = (this.clock + 1) % 384; //24ppqn * 4 quarter notes * 4 bars
		}

		// Channel messages:
		if (channel === 0 || channel === (data[0] & 0x0f) + 1) {
			let type = data[0] >> 4;

			if (type === 0x9 && data[2] === 0 && transformNoteOnVelocityZeroAsNoteOff) {
				type = 0x8;
			}

			if (type === 0x9 && allowNoteOn) return this.send("note-on", data);
			if (type === 0x8 && allowNoteOff) return this.send("note-off", data);
			if (type === 0xb && allowCC) return this.send("cc", data);
		}
	}

	onMIDISuccess(midiAccess) {
		console.log("MIDI SUCCESS", midiAccess);
		this.inputs = midiAccess.inputs;
		let select = this.root.getElementById("select");

		let option = document.createElement("option");
		option.innerText = "Select device...";
		option.value = "";
		select.appendChild(option);

		for (let input of this.inputs.values()) {
			console.log(input);
			option = document.createElement("option");
			option.innerText = input.manufacturer + " " + input.name;
			option.value = input.id;
			select.appendChild(option);
		}

		// let deviceId = this.getAttribute('device-id');
		// select.value = deviceId;

		select.addEventListener("change", event => {
			console.log("you did it", event.target.value);
			this.setAttribute("device-id", event.target.value);
		});

		// Force listener to listen:
		this.setInput(this.getAttribute("device-id"));
	}

	onMIDIFailure() {
		alert("Unable to obtain MIDI access!");
	}

	onReady() {
		console.log("MIDIDEVICE READY!");

		this.boundOnMIDIMessage = this.onMIDIMessage.bind(this);
		navigator
			.requestMIDIAccess()
			.then(this.onMIDISuccess.bind(this), this.onMIDIFailure.bind(this));
	}

	onDestroy() {
		console.error("MIDIDEVICE DESTROY!");
		this.removeMIDIListeners();
	}
}

const t = `<div>
	<select id="select"></select>
</div>`;

export default {
	label: "MIDI Device",
	text: MIDIDevice.toString(),
	templateHTML: t
};
