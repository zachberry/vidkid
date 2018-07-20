const t = `class ThreeJSTwoCubes extends N {
	static get inputs() {
		return [
			{
				name: "step",
				observe: true,
				control: N.button()
			},
			{
				name: "tween-time",
				observe: true,
				defaultValue: 1000,
				restrict: Number
			}
		];
	}

	getRand() {
		return Math.random() * this.randFactor - this.randFactor / 2
	}

	getTweenTime() {
		return parseFloat(this.getAttribute('tween-time'));
	}

	moveCube() {
		this.cubePos = {
			x: this.cube.position.x,
			y: this.cube.position.y,
			z: this.cube.position.z
		}
		this.cubeRot = {
			x: this.cube.rotation.x,
			y: this.cube.rotation.y,
			z: this.cube.rotation.z
		}
		this.tween1 = new TWEEN.Tween(this.cubePos)
			.to(
				{
					x: this.getRand(),
					y: this.getRand(),
					z: this.getRand()
				},
				this.getTweenTime()
			)
			.easing(TWEEN.Easing.Quadratic.InOut)
			.onUpdate(this.boundOnTweenUpdate)
		this.tween2 = new TWEEN.Tween(this.cubeRot)
			.to(
				{
					x: this.getRand(),
					y: this.getRand(),
					z: this.getRand()
				},
				this.getTweenTime()
			)
			.easing(TWEEN.Easing.Quadratic.InOut)
			.onUpdate(this.boundOnTweenUpdate)

		this.camPos = {
			x: this.camera.position.x,
			y: this.camera.position.y,
			z: this.camera.position.z
		}
		this.camRot = {
			x: this.camera.rotation.x,
			y: this.camera.rotation.y,
			z: this.camera.rotation.z
		}
		this.tween3 = new TWEEN.Tween(this.camPos)
			.to(
				{
					x: this.getRand(),
					y: this.getRand(),
					z: this.getRand()
				},
				this.getTweenTime()
			)
			.easing(TWEEN.Easing.Quadratic.InOut)
			.onUpdate(this.boundOnTweenUpdate)
		this.tween4 = new TWEEN.Tween(this.camRot)
			.to(
				{
					x: this.getRand(),
					y: this.getRand(),
					z: this.getRand()
				},
				this.getTweenTime()
			)
			.easing(TWEEN.Easing.Quadratic.InOut)
			.onUpdate(this.boundOnTweenUpdate)

		this.tween1.start()
		this.tween2.start()
		this.tween3.start()
		this.tween4.start()
	}

	onTweenUpdate() {
		this.cube.position.x = this.cubePos.x
		this.cube.position.y = this.cubePos.y
		this.cube.position.z = this.cubePos.z

		this.cube.rotation.x = this.cubeRot.x
		this.cube.rotation.y = this.cubeRot.y
		this.cube.rotation.z = this.cubeRot.z

		this.camera.position.x = this.camPos.x
		this.camera.position.y = this.camPos.y
		this.camera.position.z = this.camPos.z

		this.camera.rotation.x = this.camRot.x
		this.camera.rotation.y = this.camRot.y
		this.camera.rotation.z = this.camRot.z
	}

	animate() {
		if (!this.active) return;
		requestAnimationFrame(this.boundAnimate);

		TWEEN.update()
		this.camera.lookAt(this.cube.position)
		this.renderer.render(this.scene, this.camera)
	}

	resize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	readyCallback() {
		this.active = true
		this.boundAnimate = this.animate.bind(this)
		this.boundMoveCube = this.moveCube.bind(this)
		this.boundOnTweenUpdate = this.onTweenUpdate.bind(this)
		this.randFactor = 3

		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
		this.renderer = new THREE.WebGLRenderer()

		this.renderer.setSize(window.innerWidth, window.innerHeight)

		this.screen.body.appendChild(this.renderer.domElement)

		let geometry = new THREE.BoxGeometry(1, 1, 1)
		let geometry2 = new THREE.BoxGeometry(2, 2, 2)
		let material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
		let material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff })
		material.wireframe = true
		material2.wireframe = true
		this.cube = new THREE.Mesh(geometry, material)
		this.cube2 = new THREE.Mesh(geometry2, material2)
		this.scene.add(this.cube)
		this.scene.add(this.cube2)

		this.camera.position.z = 5

		this.animate()
	}

	destroyCallback() {
		this.active = false;
		this.screen.body.removeChild(this.renderer.domElement);
		window.removeEventListener('resize', this.boundResize);
	}

	screenDestroyCallback() {
		this.screen.body.removeChild(this.renderer.domElement);
	}

	screenUpdatedCallback() {
		this.screen.body.appendChild(this.renderer.domElement);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case "step":
				this.moveCube();
				break;
		}
	}
}`;

export default {
	label: "Three JS (Two Cubes)",
	text: t
};
