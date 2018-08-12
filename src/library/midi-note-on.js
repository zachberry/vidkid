const N = require("../web-components/base-node").default;
class MIDINoteOn extends N {
	static get inputs() {
		return [
			{
				name: "note-on",
				observe: true
			}
		];
	}

	static get outputs() {
		return ["number", "velocity", "both"];
	}

	onAttrChanged(name, oldValue, newValue) {
		let midiData = this.getAttribute("note-on");

		if (!(midiData instanceof Array)) return;

		let noteNum = parseInt(midiData[1], 10);
		let noteVel = parseInt(midiData[2], 10);

		this.send("number", noteNum);
		this.send("velocity", noteVel);
		this.send("both", [noteNum, noteVel]);
	}
}

export default {
	label: "MIDI Note On",
	text: MIDINoteOn.toString()
};
