const N = require("../web-components/base-node").default;
class Video extends N {
	static get type() {
		return N.SCREEN;
	}

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
				control: N.range({ min: 0, max: 1, step: 0.01 })
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
		return ["el-id"];
	}

	onReady() {
		this.boundOnLoadedVideo = this.onLoadedVideo.bind(this);
		this.videoReady = false;

		this.el = this.root.getElementById("video");
		this.elId = this.registerEl("video", this.el);
		this.el.addEventListener("loadeddata", this.boundOnLoadedVideo);
		let src = this.getAttribute("file");
		if (src) this.el.src = this.getAttribute("file");
	}

	onOutputConnected(name) {
		if (name === "el-id") {
			this.send("el-id", this.elId);
		}
	}

	onOutputWillDisconnect(name, toAddr) {
		if (name === "el-id") {
			this.sendTo("el-id", toAddr, null);
		}
	}

	onDestroy() {
		this.videoReady = false;
		this.el.removeEventListener("loadeddata", this.boundOnLoadedVideo);
		this.el.src = null;

		this.root.getElementById("container").appendChild(this.el);
	}

	onScreenUpdated() {
		this.onSelectorUpdated();
	}

	updateVideo() {
		this.el.currentTime = parseFloat(this.getAttribute("time")) * this.el.duration;
		this.el.loop = this.getAttribute("loop");
		this.el.muted = this.getAttribute("muted");
		this.getAttribute("play") ? this.el.play() : this.el.pause();
	}

	onLoadedVideo(event) {
		this.updateVideo();
		this.videoReady = true;
	}

	onSelectorUpdated() {
		let sel = this.getAttribute("selector");

		try {
			let el = this.screen.querySelector(sel);
			if (el) {
				el.appendChild(this.el);
			} else {
				this.root.getElementById("container").appendChild(this.el);
			}
		} catch (e) {
			this.root.getElementById("container").appendChild(this.el);
		}
	}

	onAttrChanged(name, oldValue, newValue) {
		switch (name) {
			case "file":
				if (!this.el || !newValue) return;
				this.el.src = newValue;
				break;

			case "play":
				if (!this.videoReady) return;
				newValue === "true" ? this.el.play() : this.el.pause();
				break;

			case "time":
				if (!this.videoReady) return;
				if (!Number.isFinite(this.el.duration)) return;
				this.el.currentTime = parseFloat(newValue) * this.el.duration;
				break;

			case "loop":
				if (!this.videoReady) return;
				this.el.loop = Boolean(newValue === "true");
				break;

			case "muted":
				if (!this.videoReady) return;
				this.el.muted = Boolean(newValue === "true");
				break;

			case "selector":
				this.onSelectorUpdated();
				break;
		}
	}
}

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
	text: Video.toString(),
	templateHTML: template,
	templateCSS: css
};
