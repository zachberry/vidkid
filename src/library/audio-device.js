const N = require("../web-components/base-node").default;
class AudioDevice extends N {
	static get type() {
		return N.HARDWARE;
	}

	static get inputs() {
		return [
			{
				name: "device-id",
				observe: true,
				defaultValue: "default",
				restrict: String,
				visible: false
			},
			{
				name: "fft-size",
				observe: true,
				defaultValue: "256",
				restrict: N.set(["128", "256", "512", "1024", "2048", "4096", "8192", "16384"])
			},
			{
				name: "active",
				observe: true,
				defaultValue: true,
				restrict: Boolean
			},
			{
				name: "smooth-const",
				observe: true,
				defaultValue: 0.1,
				restrict: N.float(0, 1),
				control: N.range({ step: 0.1 })
			}
			// {
			// 	name: "filter",
			// 	observe: true,
			// 	defaultValue: false
			// },
			// {
			// 	name: "cutoff-freq",
			// 	observe: true,
			// 	defaultValue: 400,
			// 	restrict: Number
			// }
		];
	}

	static get outputs() {
		return ["rms-volume", "trigger"];
	}

	getFFTSize() {
		return parseInt(this.getAttribute("fft-size"));
	}

	listen(stream) {
		this.context = new AudioContext();
		this.analyser = this.context.createAnalyser();
		this.analyser.smoothingTimeConstant = this.getAttribute("smooth-const");
		this.analyser.fftSize = this.getFFTSize();

		this.node = this.context.createScriptProcessor(this.analyser.fftSize * 2, 1, 1);

		this.input = this.context.createMediaStreamSource(stream);
		this.input.connect(this.analyser);
		this.analyser.connect(this.node);
		this.node.connect(this.context.destination);

		this.updateListeners();
	}

	onAudioProcess() {
		this.spectrum = new Uint8Array(this.analyser.frequencyBinCount);
		this.analyser.getByteFrequencyData(this.spectrum);
		this.vol = this.getRMS(this.spectrum);

		this.send("rms-volume", this.vol);
		this.send("trigger", this.vol / 128 > 1);
	}

	getRMS(spectrum) {
		let rms = 0;
		for (let i = 0, len = spectrum.length; i < len; i++) {
			rms += spectrum[i] * spectrum[i];
		}
		rms /= spectrum.length;
		rms = Math.sqrt(rms);

		return rms;
	}

	getAudioDevices() {
		// Need to get permission for microphone so we can get more useful info in enumerateDevices
		navigator.getUserMedia(
			{ audio: true },
			this.onGetUserMediaSuccess.bind(this),
			this.onGetUserMediaError.bind(this)
		);
	}

	onGetUserMediaError() {
		console.error(arguments);
		console.error("Unable to access audio devices!");
	}

	onGetUserMediaSuccess() {
		this.createDeviceList();
	}

	createDeviceList() {
		let select = this.root.getElementById("select");
		let option = document.createElement("option");
		option.innerText = "Select device...";
		option.value = "";
		select.appendChild(option);

		navigator.mediaDevices.enumerateDevices().then(devices => {
			devices.forEach(device => {
				if (device.kind === "audioinput") {
					this.devices[device.deviceId] = device;

					let option = document.createElement("option");
					option.innerText = device.label;
					option.value = device.deviceId;
					select.appendChild(option);
				}
			});

			select.addEventListener("change", event => {
				this.setAttribute("device-id", event.target.value);
			});

			let deviceId = this.getAttribute("device-id");
			if (deviceId) select.value = deviceId;
		});
	}

	onGetDeviceSuccess(stream) {
		this.stream = stream;
		this.listen(stream);
	}

	onGetDeviceError() {
		console.error(arguments);
		console.error("Unable to get audio stream!");
	}

	selectDevice(id) {
		if (!id) return;

		var constraints = { deviceId: { exact: id } };
		navigator.getUserMedia(
			{ audio: constraints },
			this.onGetDeviceSuccess.bind(this),
			this.onGetDeviceError.bind(this)
		);
	}

	stopAudioProcessing() {
		if (this.node) {
			this.input.disconnect(this.analyser);
			this.node.onaudioprocess = null;
			delete this.node.onaudioprocess;
		}
	}

	updateListeners() {
		if (!this.node) return;

		this.node.onaudioprocess = null;
		if (this.getAttribute("active")) {
			this.node.onaudioprocess = this.boundOnAudioProcess;
		}
	}

	onReady() {
		this.context = null;
		this.analyser = null;
		this.node = null;
		this.spectrum = null;
		this.vol = null;
		this.stream = null;
		this.devices = {};
		this.boundOnAudioProcess = this.onAudioProcess.bind(this);

		this.getAudioDevices();
	}

	onRemove() {
		this.stopAudioProcessing();
	}

	onAttrChanged(name, oldValue, newValue) {
		switch (name) {
			case "device-id":
				this.stopAudioProcessing();
				this.selectDevice(newValue);
				break;

			case "fft-size":
				this.stopAudioProcessing();
				if (this.stream) this.listen(this.stream);
				break;

			case "smooth-const":
				if (this.analyser) this.analyser.smoothingTimeConstant = parseFloat(newValue);
				break;

			case "active":
				this.updateListeners();
				break;

			case "stop-audio":
				this.stopAudioProcessing();
				break;
		}
	}
}

const template = `<div id="container">
	<select id="select"></select>
</div>`;

const css = `#container {
	width: 13em;
}

#select {
	width: 100%;
}`;

export default {
	label: "Audio Device",
	text: AudioDevice.toString(),
	templateHTML: template,
	templateCSS: css
};
