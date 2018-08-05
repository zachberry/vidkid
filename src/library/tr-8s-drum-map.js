const c = `class TR8SDrumMap extends N {

	static get inputs() {
		return [
			{
				name: "note-on",
				observe: true,
				defaultValue: "",
				restrict: String
			}
		];
	}

	static get outputs() {
		return ["BD", "SD", "LT", "MT", "HT", "RS", "HC", "CH", "OH", "CC", "RC"];
	}

	onAttrChanged(name, oldValue, newValue) {
		console.log('ACC', name, oldValue, newValue);

		let midiData = newValue;
		let noteNum = parseInt(midiData.split(",")[1])

		switch(noteNum) {
			case 0x24: this.send("BD", midiData); break;
			case 0x26: this.send("SD", midiData); break;
			case 0x2B: this.send("LT", midiData); break;
			case 0x2F: this.send("MT", midiData); break;
			case 0x32: this.send("HT", midiData); break;
			case 0x25: this.send("RS", midiData); break;
			case 0x27: this.send("HC", midiData); break;
			case 0x2A: this.send("CH", midiData); break;
			case 0x2E: this.send("OH", midiData); break;
			case 0x31: this.send("CC", midiData); break;
			case 0x33: this.send("RC", midiData); break;
		}
	}
}`;

export default {
	label: "TR-8s Drum Map",
	text: c
};
