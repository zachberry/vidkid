const t = `class MIDIDevice extends N {
	static get inputs() {
		return [
			{
				name: "device-id",
				observe: true,
				defaultValue: "",
				restrict: String,
				control: N.text({ editable: false })
			}
		];
	}

	static get outputs() {
		return ["message"];
	}

	constructor() {
		super();
		this.midiReady = false;
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if(!this.midiReady) return false;

		this.removeMIDIListeners();

		if (newValue !== "") {
			let input = this.inputs.get(newValue);
			if (input) {
				input.addEventListener("midimessage", this.boundOnMIDIMessage);
			}
			this.root.getElementById('select').value = newValue;
		}
	}

	removeMIDIListeners() {
		if (!this.inputs) return;
		for (let input of this.inputs.values()) {
			input.removeEventListener("midimessage", this.boundOnMIDIMessage);
		}
	}

	onMIDIMessage(event) {
		this.send('message', event.data.toString())
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

		this.midiReady = true;

		// Force listener to listen:
		this.setAttribute('device-id', this.getAttribute('device-id'));
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

export default {
	label: "MIDI Device",
	text: t
};
