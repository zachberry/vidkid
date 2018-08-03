const t = `class ThreeJS extends N {
	static get type() { return N.SCREEN }

	static get inputs() {
		return [
			{
				name: "camera-z",
				observe: true,
				defaultValue: 5,
				restrict: Number,
				control: N.range({ min:-10, max:200 })
			},
			{
				name: "color",
				observe: true,
				defaultValue: '#FF0000',
				restrict: String,
				control: N.color()
			},
			{
				name: "wireframe",
				observe: true,
				defaultValue: true,
				restrict: Boolean
			}
		];
	}

	static get outputs() {
		return ["my-output"];
	}

	animate() {
		if (!this.active) return;
		requestAnimationFrame(this.boundAnimate);

		this.cube.rotation.x += 0.01;
		this.cube.rotation.y += 0.01;

		this.renderer.render(this.scene, this.camera);
	}

	resize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	readyCallback() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);

		this.renderer = new THREE.WebGLRenderer();
		this.domElement = this.renderer.domElement;
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		// debugger;
		this.screen.body.appendChild(this.domElement);

		let geometry = new THREE.BoxGeometry(3, 3, 3);
		let material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
		this.cube = new THREE.Mesh(geometry, material);
		this.scene.add(this.cube);

		this.camera.position.z = 5;

		this.boundAnimate = this.animate.bind(this);
		this.boundResize = this.resize.bind(this);
		this.active = true;
		this.animate();

		window.addEventListener('resize', this.boundResize);
	}

	destroyCallback() {
		this.active = false;
		this.screen.body.removeChild(this.domElement);
		window.removeEventListener('resize', this.boundResize);
	}

	screenDestroyCallback() {
		this.screen.body.removeChild(this.domElement);
	}

	screenUpdatedCallback() {
		this.screen.body.appendChild(this.domElement);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case "camera-z":
				this.camera.position.z = newValue;
				break;

			case "color":
				this.cube.material.color = new THREE.Color(newValue)
				break;

			case "wireframe":
				this.cube.material.wireframe = Boolean(newValue === "true");
				break;
		}
	}
}`;

export default {
	label: "Three JS",
	text: t
};
