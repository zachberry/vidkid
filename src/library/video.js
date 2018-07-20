const t = `class Video extends N {
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
				defaultValue: "video",
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

	readyCallback() {
		//this.el = document.createElement('video');
		//this.screen.body.appendChild(this.el);
		this.boundOnLoadedVideo = this.onLoadedVideo.bind(this);
		this.videoReady = false;
	}

	destroyCallback() {
		//this.screen.body.removeChild(this.el);
		if(this.el) this.clearEl(this.el);
	}

	screenDestroyCallback() {
		//this.screen.body.removeChild(this.el);
		console.log('--V-->screenDestroy', this.el)
		if(this.el) this.clearEl(this.el);
	}

	screenUpdatedCallback() {
		//this.screen.body.appendChild(this.el);
		console.log('--V-->screenUpdated')
		let el = this.getVideoEl(this.getAttribute('selector'));
		if(el) {
			this.setEl(el);
		}
	}

	getVideoEl(selector) {
		try {
			let el = this.screen.querySelector(selector);
			if(el && el.tagName && el.tagName.toLowerCase() === 'video') return el;
		} catch(e) {
			return null;
		}

		return null;
	}

	updateVideo() {
		console.log('--V-->updating video')
		this.el.currentTime = parseFloat(this.getAttribute('time')) * this.el.duration;
		this.el.loop = Boolean(this.getAttribute('loop') === "true");
		this.el.muted = Boolean(this.getAttribute('muted') === "true");
		Boolean(this.getAttribute('play') === "true") ? this.el.play() : this.el.pause()
	}

	onLoadedVideo(event) {
		console.log('--V-->video loaded', event);
		this.updateVideo();
		this.videoReady = true;
	}

	setEl(el) {
		this.videoReady = false;
		console.log('--V-->setEl', el)
					this.el = el;
					this.el.addEventListener('loadeddata', this.boundOnLoadedVideo)
					let src = this.getAttribute('file');
					if(src) this.el.src = this.getAttribute('file');
	}

	clearEl(el) {
		this.videoReady = false;
		console.log('--V-->clearEl', el)
					el.removeEventListener('loadeddata', this.boundOnLoadedVideo);
					el.src = null;
					this.el = null;
	}

	attributeChangedCallback(name, oldValue, newValue) {
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
				console.log('--V-->selector update', oldValue, newValue)

				let oldEl = this.getVideoEl(oldValue);
				console.log('--V-->oldEl', oldEl)
				if(oldEl) {

					this.clearEl(oldEl);
				}

				let newEl = this.getVideoEl(newValue);
				if(newEl) {
					this.setEl(newEl);
				}

				console.log('selector', oldValue, newValue, oldEl, newEl)
		}
	}
}`;

export default {
	label: "Video",
	text: t
};
