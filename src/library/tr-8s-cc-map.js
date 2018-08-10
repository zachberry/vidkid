const N = require("../web-components/base-node").default;
class TR8SCCMap extends N {
	static get inputs() {
		return [
			{
				name: "cc",
				observe: true
			}
		];
	}

	static get outputs() {
		return ["BD", "SD", "LT", "MT", "HT", "RS", "HC", "CH", "OH", "CC", "RC"];
	}

	onAttrChanged(name, oldValue, newValue) {
		let midiData = this.getAttribute("cc");

		if (!(midiData instanceof Array)) return;

		let ccNum = parseInt(midiData[1], 10);
		let ccVal = parseInt(midiData[2], 10);

		console.log("md", midiData, ccNum, ccVal);

		switch (ccNum) {
			case 0x18:
				this.send("BD", ccVal);
				break;
			case 0x1d:
				this.send("SD", ccVal);
				break;
			case 0x30:
				this.send("LT", ccVal);
				break;
			case 0x33:
				this.send("MT", ccVal);
				break;
			case 0x36:
				this.send("HT", ccVal);
				break;
			case 0x39:
				this.send("RS", ccVal);
				break;
			case 0x3c:
				this.send("HC", ccVal);
				break;
			case 0x3f:
				this.send("CH", ccVal);
				break;
			case 0x52:
				this.send("OH", ccVal);
				break;
			case 0x55:
				this.send("CC", ccVal);
				break;
			case 0x58:
				this.send("RC", ccVal);
				break;
		}
	}
}

export default {
	label: "TR-8S CC Map",
	text: TR8SCCMap.toString()
};
