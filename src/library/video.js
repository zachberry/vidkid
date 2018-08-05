const t = `class Video extends N {
	static get type() { return N.SCREEN }

	static get inputs() {
		return [
			{
				name: "file",
				observe: true,
				restrict: String,
				control: N.file()
			},
			{
				name: "selector",
				observe: true,
				defaultValue: "",
				restrict: String
			},
			{
				name: "play",
				observe: true,
				defaultValue: false,
				restrict: Boolean
			},
			{
				name: "time",
				observe: true,
				defaultValue: 0,
				restrict: N.float(0, 1),
				control: N.range({min:0, max:1, step:0.01})
			},
			{
				name: "loop",
				observe: true,
				defaultValue: true,
				restrict: Boolean
			},
			{
				name: "muted",
				observe: true,
				defaultValue: true,
				restrict: Boolean
			}
		];
	}

	static get outputs() {
		return ['video-el']
	}

	onReady() {
		this.boundOnLoadedVideo = this.onLoadedVideo.bind(this);
		this.videoReady = false;

		this.el = this.root.getElementById('video');
		this.el.addEventListener('loadeddata', this.boundOnLoadedVideo)
		let src = this.getAttribute('file');
		if(src) this.el.src = this.getAttribute('file');

		this.send('video-el', this.el);
	}

	onOutputConnected(name) {
		if(name === 'video-el') {
			this.send('video-el', this.el)
		}
	}

	onDestroy() {
		this.videoReady = false;
		this.el.removeEventListener('loadeddata', this.boundOnLoadedVideo);
		this.el.src = null;
		this.el = null;
	}

	onScreenUpdated() {
		this.onSelectorUpdated()
	}

	onScreenDestroy() {
		if(this.el) this.clearEl(this.el);
	}

	// onScreenUpdated() {
	// 	let el = this.getVideoEl(this.getAttribute('selector'));
	// 	if(el) {
	// 		this.setEl(el);
	// 	}
	// }

	// getVideoEl(selector) {
	// 	try {
	// 		let el = this.screen.querySelector(selector);
	// 		if(el && el.tagName && el.tagName.toLowerCase() === 'video') return el;
	// 	} catch(e) {
	// 		return null;
	// 	}

	// 	return null;
	// }

	updateVideo() {
		console.log('--V-->updating video')
		this.el.currentTime = parseFloat(this.getAttribute('time')) * this.el.duration;
		this.el.loop = this.getAttribute('loop');
		this.el.muted = this.getAttribute('muted');
		this.getAttribute('play') ? this.el.play() : this.el.pause()
	}

	onLoadedVideo(event) {
		console.log('--V-->video loaded', event);
		this.updateVideo();
		this.videoReady = true;
	}

	// setEl(el) {
	// 	this.videoReady = false;
	// 	console.log('--V-->setEl', el)
	// 	this.el = el;
	// 	this.el.addEventListener('loadeddata', this.boundOnLoadedVideo)
	// 	let src = this.getAttribute('file');
	// 	if(src) this.el.src = this.getAttribute('file');
	// }

	// clearEl(el) {
	// 	this.videoReady = false;
	// 	console.log('--V-->clearEl', el)
	// 	el.removeEventListener('loadeddata', this.boundOnLoadedVideo);
	// 	el.src = null;
	// 	this.el = null;
	// }

	onSelectorUpdated() {
		let sel = this.getAttribute('selector');

		try {
			let el = this.screen.querySelector(sel);
			if(el) {
				el.appendChild(this.el)
			} else {
				this.root.getElementById('container').appendChild(this.el);
			}
		}
		catch(e) {
			this.root.getElementById('container').appendChild(this.el);
		}
	}

	onAttrChanged(name, oldValue, newValue) {
		console.log('--V-->VIDEO ATTR', name, oldValue, newValue)
		switch(name)
		{
			case "file":
				if(!this.el || !newValue) return;
				console.log('--V-->set src to', newValue);
				this.el.src = newValue;
				break;

			case "play":
				if(!this.videoReady) return;
				newValue === "true" ? this.el.play() : this.el.pause()
				break;

			case "time":
				if(!this.videoReady) return;
				if(!Number.isFinite(this.el.duration)) return;
				this.el.currentTime = parseFloat(newValue) * this.el.duration;
				break;

			case "loop":
				if(!this.videoReady) return;
				this.el.loop = Boolean(newValue === "true");
				break;

			case "muted":
				if(!this.videoReady) return;
				this.el.muted = Boolean(newValue === "true");
				break;

			case "selector":
				this.onSelectorUpdated();
				// console.log('--V-->selector update', oldValue, newValue)

				// let oldEl = this.getVideoEl(oldValue);
				// console.log('--V-->oldEl', oldEl)
				// if(oldEl) {

				// 	this.clearEl(oldEl);
				// }

				// let newEl = this.getVideoEl(newValue);
				// if(newEl) {
				// 	this.setEl(newEl);
				// }

				// console.log('selector', oldValue, newValue, oldEl, newEl)
		}
	}
}`;

const template = `<div id="container">
	<video id="video"></video>
</div>`;

const css = `#container {
	width: 13em;
}
#container > video {
	width: 100%;
	background: black;
}`;

export default {
	label: "Video",
	text: t,
	templateHTML: template,
	templateCSS: css
};
