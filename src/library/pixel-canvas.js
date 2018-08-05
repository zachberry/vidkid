const t = `class PixelCanvas extends N {
	static get inputs() {
		return [
			{
				name: 'selector',
				observe: true,
				defaultValue: '',
				restrict: String
			},
			{
				name: "canvas-el",
				observe: true,
				defaultValue: null
			},
			{
				name: "pixel-size",
				observe: false,
				defaultValue: 50,
				restrict: N.int(2),
				control: N.range({min:2, max:400})
			},
			{
				name: "margin-size",
				observe: false,
				defaultValue: 0,
				restrict: N.int(0),
				control: N.range({min:0, max:400})
			},
			{
				name: "capture",
				observe: true,
				control: N.button()
			}
		];
	}

	static get outputs() {
		return ["el", "context", "captured"];
	}

	onSelectorUpdated() {
		let sel = this.getAttribute('selector');

		try {
			let el = this.screen.querySelector(sel);
			if(el) {
				el.appendChild(this.canvasEl)
			} else {
				this.root.getElementById('container').appendChild(this.canvasEl);
			}
		}
		catch(e) {
			this.root.getElementById('container').appendChild(this.canvasEl);
		}
	}

	onOutputConnected(name) {
		switch(name) {
			case 'el':
				this.send('el', this.canvasEl);
				break;

			case 'context':
				this.send('context', this.canvasEl.getContext('2d'));
				break;
		}
	}

	onReady() {
		this.extCanvasEl = null;
		this.extCanvasCtx = null;
		this.canvasEl = this.root.getElementById('canvas');
		this.canvasCtx = this.canvasEl.getContext('2d');
		this.boundOnFrame = this.onFrame.bind(this);
	}

	onFrame() {
		if(!this.extCanvasEl || !this.canvasEl) return

		let w = this.extCanvasEl.width;
		let h = this.extCanvasEl.height;

		this.canvasEl.width = w;
		this.canvasEl.height = h;

		this.canvasCtx.clearRect(0, 0, w, h);

		let blockSize = this.getAttribute('pixel-size');
		let marginSize = this.getAttribute('margin-size');
		let innerBlockSize = Math.max(1, blockSize - marginSize - marginSize);

		let fw = Math.ceil(w / blockSize) * blockSize;
		let fh = Math.ceil(h / blockSize) * blockSize;
		for (let x = -(fw - w) / 2; x < fw; x += blockSize) {
			for (let y = -(fh - h) / 2; y < fh; y += blockSize) {
				let pixel = this.extCanvasCtx.getImageData(x + blockSize / 2, y + blockSize / 2, 1, 1);
				let d = pixel.data;
				this.canvasCtx.fillStyle = 'rgb(' + d[0] + ',' + d[1] + ',' + d[2] + ')';
				let diff = (blockSize - innerBlockSize) / 2;
				this.canvasCtx.fillRect(Math.floor(x + diff), Math.floor(y + diff), innerBlockSize, innerBlockSize);
			}
		}

		// this.canvasCtx.drawImage(extEl, 0, 0, canvas.width, canvas.height);
		// this.send("captured", true);
	}

	onScreenUpdated() {
		this.onSelectorUpdated()
	}

	onAttrChanged(name, oldValue, newValue) {
		// debugger;
		switch(name) {
			case 'canvas-el':
				let el = this.getAttribute('canvas-el');
				if(el && el.tagName && el.tagName.toLowerCase() === 'canvas') {
					this.extCanvasEl = el;
					this.extCanvasCtx = this.extCanvasEl.getContext('2d');
				}
				break;

			case 'selector':
				this.onSelectorUpdated();
				break;

			case 'capture':
				break;
		}

		this.onFrame();
	}

}`;

const template = `<div id="container">
	<canvas id="canvas" width="640" height="480"></select>
</div>`;

const css = `#container {
	width: 13em;
}

canvas {
	width: 100%;
	max-height: 13em;
	background: black;
}`;

export default {
	label: "PixelCanvas",
	text: t,
	templateHTML: template,
	templateCSS: css
};
