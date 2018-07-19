const c = `class MIDIDevice extends N {
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
				name: "clock",
				observe: false,
				defaultValue: true,
				restrict: Boolean
			},
			{
				name: "note-on",
				observe: false,
				defaultValue: true,
				restrict: Boolean
			},
			{
				name: "note-off",
				observe: false,
				defaultValue: true,
				restrict: Boolean
			},
			{
				name: "cc",
				observe: false,
				defaultValue: true,
				restrict: Boolean
			}
		];
	}

	static get outputs() {
		return ["message"];
	}

	constructor() {
		super();
	}

	setInput(id) {
		console.log('SET INPUT', id);
		if(!this.inputs) return;

		this.removeMIDIListeners();

		if (id !== "") {
			let input = this.inputs.get(id);
			if (input) {
				input.addEventListener("midimessage", this.boundOnMIDIMessage);
			}
		}

		this.root.getElementById('select').value = id;
	}

	attributeChangedCallback(name, oldValue, newValue) {
		console.log('ACC', name, oldValue, newValue);
		this.setInput(newValue);
	}

	removeMIDIListeners() {
		if (!this.inputs) return;
		for (let input of this.inputs.values()) {
			input.removeEventListener("midimessage", this.boundOnMIDIMessage);
		}
	}

	onMIDIMessage(event) {
		let data = event.data;
		let channel = parseInt(this.getAttribute('channel'), 10) || 0;
		let allowClock = this.getAttribute('clock') === "true";
		let allowNoteOn = this.getAttribute('note-on') === "true";
		let allowNoteOff = this.getAttribute('note-off') === "true";
		let allowCC = this.getAttribute('cc') === "true";

		console.log('got midi', data, channel, allowClock, allowNoteOn, allowNoteOff, allowCC)

		// Clock:
		if(data[0] === 0xF0 && allowClock) {
			this.send('message', event.data.toString())
		}

		// Channel messages:
		if(channel === 0 || channel === (data[0] & 0x0F) + 1) {
			let type = data[0] >> 4;

			if(
				(type === 0x8 && allowNoteOn)
				|| (type === 0x9 && allowNoteOff)
				|| (type === 0xB && allowCC)
			) {
				this.send('message', event.data.toString());
			}
		}
	}

	onMIDISuccess(midiAccess) {
		console.log('MIDI SUCCESS', midiAccess);
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
		this.setInput(this.getAttribute('device-id'));
	}

	onMIDIFailure() {
		alert("Unable to obtain MIDI access!");
	}

	readyCallback() {
		console.log("MIDIDEVICE READY!");

		this.boundOnMIDIMessage = this.onMIDIMessage.bind(this);
		navigator
			.requestMIDIAccess()
			.then(this.onMIDISuccess.bind(this), this.onMIDIFailure.bind(this));
	}

	destroyCallback() {
		console.error("MIDIDEVICE DESTROY!");
		this.removeMIDIListeners();
	}
}`;

const t = `<div>
	<select id="select"></select>
</div>`;

export default {
	label: "MIDI Device",
	text: c,
	templateHTML: t
};
