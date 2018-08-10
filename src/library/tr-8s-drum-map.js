const N = require("../web-components/base-node").default;
class TR8SDrumMap extends N {
	static get inputs() {
		return [
			{
				name: "note-on",
				observe: true
			}
		];
	}

	static get outputs() {
		return ["BD", "SD", "LT", "MT", "HT", "RS", "HC", "CH", "OH", "CC", "RC"];
	}

	onAttrChanged(name, oldValue, newValue) {
		let midiData = this.getAttribute("note-on");
		if (!(midiData instanceof Array)) return;

		let noteNum = parseInt(midiData[1], 10);

		switch (noteNum) {
			case 0x24:
				this.send("BD", midiData);
				break;
			case 0x26:
				this.send("SD", midiData);
				break;
			case 0x2b:
				this.send("LT", midiData);
				break;
			case 0x2f:
				this.send("MT", midiData);
				break;
			case 0x32:
				this.send("HT", midiData);
				break;
			case 0x25:
				this.send("RS", midiData);
				break;
			case 0x27:
				this.send("HC", midiData);
				break;
			case 0x2a:
				this.send("CH", midiData);
				break;
			case 0x2e:
				this.send("OH", midiData);
				break;
			case 0x31:
				this.send("CC", midiData);
				break;
			case 0x33:
				this.send("RC", midiData);
				break;
		}
	}
}

export default {
	label: "TR-8S Drum Map",
	text: TR8SDrumMap.toString()
};
