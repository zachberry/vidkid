const N = require("../web-components/base-node").default;
class DrawNotes extends N {
	static get inputs() {
		return [
			{
				name: "canvas-el-id",
				observe: true,
				defaultValue: null
			},
			{
				name: "note-number",
				observe: true,
				defaultValue: 60,
				restrict: N.int(0, 127)
			},
			{
				name: "lowest-note",
				observe: false,
				defaultValue: 0,
				restrict: N.int(0, 127)
			},
			{
				name: "highest-note",
				observe: false,
				defaultValue: 127,
				restrict: N.int(0, 127)
			},
			{
				name: "color",
				observe: false,
				defaultValue: "#FF0000",
				restrict: String,
				control: N.color()
			}
		];
	}

	onReady() {
		this.extCanvasEl = null;
		this.extCanvasCtx = null;
	}

	drawNote(num) {
		if (!this.extCanvasEl) return;

		let w = this.extCanvasEl.width;
		let h = this.extCanvasEl.height;

		let lowest = this.getAttribute("lowest-note");
		let highest = this.getAttribute("highest-note");
		let numNotes = highest - lowest;
		num -= lowest;

		let lineWidth = w / numNotes;

		this.extCanvasCtx.clearRect(0, 0, w, h);

		this.extCanvasCtx.fillStyle = this.getAttribute("color");
		this.extCanvasCtx.fillRect(num * lineWidth, 0, lineWidth, h);
	}

	onAttrChanged(name, oldValue, newValue) {
		switch (name) {
			case "canvas-el-id":
				let el = this.getEl(newValue);
				if (el && el.tagName && el.tagName.toLowerCase() === "canvas") {
					this.extCanvasEl = el;
					this.extCanvasCtx = this.extCanvasEl.getContext("2d");
				} else {
					this.extCanvasEl = null;
					this.extCanvasCtx = null;
				}
				break;

			case "note-number":
				this.drawNote(parseInt(newValue));
				break;
		}
	}
}

export default {
	label: "Draw Notes",
	text: DrawNotes.toString()
};
