const t = `class Canvas extends N {
	static get inputs() {
		return [
			{
				name: 'selector',
				observe: true,
				defaultValue: '',
				restrict: String
			},
			{
				name: "el",
				observe: true,
				defaultValue: null
			},
			{
				name: "width",
				observe: true,
				defaultValue: 640,
				restrict: Number,
				control: N.range({min:1, max:2000})
			},
			{
				name: "height",
				observe: true,
				defaultValue: 480,
				restrict: Number,
				control: N.range({min:1, max:2000})
			},
			{
				name: "capture",
				observe: true,
				control: N.button()
			},
			{
				name: "live-capture",
				observe: true,
				defaultValue: false,
				restrict: Boolean
			},
			{
				name: "preview",
				observe: true,
				defaultValue: true,
				restrict: Boolean
			}
		];
	}

	static get outputs() {
		return ["el", "captured"];
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
		}
	}

	onInputDisconnected(name) {
		switch(name) {
			case 'el': {
				this.setAttribute('el', null);
			}
		}
	}

	onReady() {
		this.dead = false;
		this.canvasEl = this.root.getElementById('canvas');
		this.boundOnFrame = this.onFrame.bind(this);
		this.send('el', this.canvasEl);
	}

	onFrame() {
		if(this.dead) return;

		let extEl = this.getAttribute('el');
		if(!extEl || !extEl.tagName || !this.canvasEl) return;
		let canvas = this.canvasEl;
		let ctx = canvas.getContext('2d');
		ctx.drawImage(extEl, 0, 0, canvas.width, canvas.height);
		this.send("captured", true);

		if(this.getAttribute('live-capture')) window.requestAnimationFrame(this.boundOnFrame);
	}

	onScreenUpdated() {
		this.onSelectorUpdated()
	}

	onDestroy() {
		this.dead = true;
		this.root.getElementById('container').appendChild(this.canvasEl);
	}

	onAttrChanged(name, oldValue, newValue) {
		switch(name) {
			case 'el':
				this.onFrame();
				break;

			case 'selector':
				this.onSelectorUpdated();
				break;

			case 'width':
				this.canvasEl.width = this.getAttribute('width');
				break;

			case 'height':
				this.canvasEl.height = this.getAttribute('height');
				break;

			case 'capture':
				this.onFrame();
				break;

			case 'live-capture':
				let liveCapture = this.getAttribute('live-capture');
				if(liveCapture) this.onFrame();
				break;

			case 'preview':
				if(this.getAttribute('preview')) {
					this.root.getElementById('container').style.display = 'block';
				} else {
					this.root.getElementById('container').style.display = 'none';
				}
				break;

		}
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
	label: "Canvas",
	text: t,
	templateHTML: template,
	templateCSS: css
};
