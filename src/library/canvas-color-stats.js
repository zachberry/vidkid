const N = require("../web-components/base-node").default;
class CanvasColorStats extends N {
	static get inputs() {
		return [
			{
				name: "el-id",
				observe: true,
				defaultValue: null
			},
			{
				name: "sample-size",
				observe: false,
				defaultValue: 50,
				restrict: N.int(2),
				control: N.range({ min: 2, max: 400 })
			},
			{
				name: "capture",
				observe: true,
				control: N.button()
			}
		];
	}

	static get outputs() {
		return ["r", "g", "b", "captured"];
	}

	onOutputConnected(name) {
		switch (name) {
			case "el-id":
				this.send("el-id", this.elId);
				break;
		}
	}

	onOutputWillDisconnect(name, toAddr) {
		if (name === "el-id") {
			this.sendTo("el-id", toAddr, null);
		}
	}

	onReady() {
		this.extCanvasEl = null;
		this.extCanvasCtx = null;
		this.boundOnFrame = this.onFrame.bind(this);
	}

	onFrame() {
		if (!this.extCanvasEl) return;

		let w = this.extCanvasEl.width;
		let h = this.extCanvasEl.height;

		let blockSize = this.getAttribute("sample-size");

		let r = 0;
		let g = 0;
		let b = 0;
		let total = 0;

		let fw = Math.ceil(w / blockSize) * blockSize;
		let fh = Math.ceil(h / blockSize) * blockSize;
		for (let x = -(fw - w) / 2; x < fw; x += blockSize) {
			for (let y = -(fh - h) / 2; y < fh; y += blockSize) {
				let pixel = this.extCanvasCtx.getImageData(x + blockSize / 2, y + blockSize / 2, 1, 1);
				let d = pixel.data;
				r += d[0];
				g += d[1];
				b += d[2];
				total += 255;
			}
		}

		// this.canvasCtx.drawImage(extEl, 0, 0, canvas.width, canvas.height);
		this.send("captured", true);
		this.send("r", r / total);
		this.send("g", g / total);
		this.send("b", b / total);
	}

	onAttrChanged(name, oldValue, newValue) {
		// debugger;
		switch (name) {
			case "el-id":
				let el = this.getEl(newValue);
				if (el && el.tagName && el.tagName.toLowerCase() === "canvas") {
					this.extCanvasEl = el;
					this.extCanvasCtx = this.extCanvasEl.getContext("2d");
				}
				break;

			case "capture":
				break;
		}

		this.onFrame();
	}
}

export default {
	label: "Canvas Color Stats",
	text: CanvasColorStats.toString()
};
