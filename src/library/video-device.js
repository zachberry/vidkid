const t = `class VideoDevice extends N {
	static get type() { return N.HARDWARE };

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
				name: "preview",
				observe: true,
				defaultValue: true,
				restrict: Boolean
			}
		];
	}

	static get outputs() {
		return ["stream", "video-el"];
	}

	getVideoDevices() {
		// Need to get permission for user media so we can get more useful info in enumerateDevices
		navigator.getUserMedia(
			{ video: true },
			this.onGetUserMediaSuccess.bind(this),
			this.onGetUserMediaError.bind(this)
		);
	}

	onGetUserMediaError() {
		console.error(arguments);
		alert("Unable to access video devices!");
	}

	onGetUserMediaSuccess() {
		this.createDeviceList();
	}

	createDeviceList() {
		let select = this.root.getElementById('select')
		let option = document.createElement("option");
		option.innerText = "Select device...";
		option.value = "";
		select.appendChild(option);

		console.log('ACC CDL', this.getAttribute('device-id'))

		navigator.mediaDevices.enumerateDevices().then(devices => {
			devices.forEach(device => {
				if (device.kind === "videoinput") {
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

			let deviceId = this.getAttribute('device-id')
			console.log('ACC gotem', deviceId, select.value)
			if(deviceId) select.value = deviceId

			if(deviceId === 'default' && Object.keys(this.devices).length > 0) {
				this.setAttribute('device-id', Object.keys(this.devices)[0])
			}
		});
	}

	onGetDeviceSuccess(stream) {
		console.log("GROT", stream);
		this.stream = stream
		this.root.getElementById('video').srcObject = stream
		this.root.getElementById('video').play()
		this.root.getElementById('select').value = this.getAttribute('device-id')
		this.send('stream', this.stream)
		this.send('video-el', this.root.getElementById('video'))
	}

	onGetDeviceError() {
		console.error(arguments);
		console.error("Unable to get video stream!");
	}

	selectDevice(id) {
		if(!id) return

		var constraints = { deviceId: { exact: id } };
		console.log('select', constraints)
		navigator.getUserMedia(
			{ video: constraints },
			this.onGetDeviceSuccess.bind(this),
			this.onGetDeviceError.bind(this)
		);
	}

	onReady() {
		this.stream = null;
		this.devices = {};

		this.getVideoDevices()
	}

	onOutputConnected(name) {
		if(name === 'video-el') {
			this.send('video-el', this.root.getElementById('video'))
		}
	}

	onAttrChanged(name, oldValue, newValue) {
		console.log("ACC", name, oldValue, newValue);

		switch(name) {
			case 'device-id':
				this.selectDevice(newValue);
				break;

			case 'preview':
				if(this.getAttribute('preview')) {
					this.root.getElementById('video').style.display = 'block';
				} else {
					this.root.getElementById('video').style.display = 'none';
				}
				this.selectDevice(this.getAttribute('device-id'));
				break;
		}

	}
}`;

const template = `<div id="container">
	<select id="select"></select>
	<video id="video"></video>
</div>`;

const css = `#container {
	width: 13em;
}

#select {
	width: 100%;
	margin-bottom: 1em;
}

video {
	width: 100%;
	background: black;
}`;

export default {
	label: "Video Device",
	text: t,
	templateHTML: template,
	templateCSS: css
};
