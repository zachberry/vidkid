const THREE = require("three");
const TWEEN = require("@tweenjs/tween.js");
const N = require("../web-components/base-node").default;
class LazerGrid extends N {
	static get type() {
		return N.SCREEN;
	}

	static get inputs() {
		return [
			{
				name: "selector",
				observe: true,
				defaultValue: "",
				restrict: String
			},
			{
				name: "speed",
				observe: false,
				defaultValue: 1,
				restrict: Number,
				control: N.range({ min: 0, max: 10, step: 0.1 })
			},
			{
				name: "left-wall",
				observe: true,
				control: N.button()
			},
			{
				name: "right-wall",
				observe: true,
				control: N.button()
			},
			{
				name: "tween-bg",
				observe: true,
				control: N.button()
			},
			{
				name: "tween-light",
				observe: true,
				control: N.button()
			},
			{
				name: "invert-bg",
				observe: true,
				defaultValue: false,
				restrict: Boolean
			}
		];
	}

	onSelectorUpdated() {
		let sel = this.getAttribute("selector");
		if (!this.renderer || !this.renderer.domElement) return;

		try {
			let el = this.screen.querySelector(sel);
			if (el) {
				el.appendChild(this.renderer.domElement);
			} else {
				this.root.getElementById("container").appendChild(this.renderer.domElement);
			}
		} catch (e) {
			this.root.getElementById("container").appendChild(this.renderer.domElement);
		}
	}

	onAttrChanged(name, oldValue, newValue) {
		switch (name) {
			case "selector":
				this.onSelectorUpdated();
				break;

			case "left-wall":
				this.drawLeftWall();
				break;

			case "right-wall":
				this.drawRightWall();
				break;

			case "tween-bg":
				this.tweenBackground();
				break;

			case "tween-light":
				this.tweenLight();
				break;

			case "invert-bg":
				this.setBg(this.getAttribute("invert-bg"));
				break;
		}
	}

	onReady() {
		this.boundResize = this.onResize.bind(this);
		window.addEventListener("resize", this.boundResize);

		this.onScreenDestroy();

		this.TWEEN_TIME = 1000;
		this.color1 = 0x0;
		this.color2 = 0xffffff;

		this.active = true;
		this.boundAnimate = this.animate.bind(this);
		this.boundTweenCamera = this.tweenCamera.bind(this);

		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(this.color1);
		this.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		this.light = new THREE.AmbientLight(0x0000ff, 0.2);
		this.scene.add(this.light);

		this.lightTarget = new THREE.Object3D();
		this.scene.add(this.lightTarget);

		this.lines = [];
		this.walls = [];
		this.drawStars();
		this.drawMountains();
		this.grids = this.drawGrid();
		this.dome = this.drawDome();

		this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
		this.lightTarget.position.x = this.dome.position.x;
		this.lightTarget.position.y = this.dome.position.y;
		this.lightTarget.position.z = this.dome.position.z;
		this.directionalLight.target = this.lightTarget;
		this.scene.add(this.directionalLight);

		this.cameraTarget = new THREE.Object3D();
		this.scene.add(this.cameraTarget);

		this.camera.position.set(0, 2, 200);
		this.camera.lookAt(this.lightTarget.position);

		this.isColor1 = true;

		this.animate();
		this.tweenCamera();

		this.root.getElementById("container").appendChild(this.renderer.domElement);
	}

	tweenCamera() {
		let intervalTime = Math.max(this.TWEEN_TIME * 4, Math.random() * this.TWEEN_TIME * 16);

		let cameraTargetPos = {
			x: this.cameraTarget.position.x,
			y: this.cameraTarget.position.y,
			z: this.cameraTarget.position.z
		};
		let cameraTargetTween = new TWEEN.Tween(cameraTargetPos)
			.to(
				{
					x: Math.random() * 200 - 100,
					y: Math.random() * 8 - 4,
					z: this.cameraTarget.position.z
				},
				intervalTime
			)
			.easing(TWEEN.Easing.Quadratic.InOut)
			.onUpdate(() => {
				this.cameraTarget.position.x = cameraTargetPos.x;
				this.cameraTarget.position.y = cameraTargetPos.y;
				this.cameraTarget.position.z = cameraTargetPos.z;
			});

		let cameraPos = {
			x: this.camera.position.x,
			y: this.camera.position.y,
			z: this.camera.position.z
		};
		let cameraPosTween = new TWEEN.Tween(cameraPos)
			.to(
				{
					x: this.camera.position.x,
					y: Math.floor(Math.random() * 3 + 0),
					z: this.camera.position.z
				},
				intervalTime
			)
			.easing(TWEEN.Easing.Quadratic.InOut)
			.onUpdate(() => {
				this.camera.position.x = cameraPos.x;
				this.camera.position.y = Math.max(0, cameraPos.y);
				this.camera.position.z = cameraPos.z;
			});

		this.rotation = {
			x: this.scene.rotation.x,
			y: this.scene.rotation.y,
			z: this.scene.rotation.z
		};
		let twoPi = Math.PI * 2;
		let sceneRotationTween = new TWEEN.Tween(this.rotation)
			.to(
				{
					x: Math.random() / 80,
					y: this.scene.rotation.y,
					z: Math.random() * (twoPi / 12) - twoPi / 24
				},
				intervalTime
			)
			.easing(TWEEN.Easing.Quadratic.InOut)
			.onUpdate(() => {
				this.scene.rotation.x = this.rotation.x;
				this.scene.rotation.y = this.rotation.y;
				this.scene.rotation.z = this.rotation.z;
			});

		cameraTargetTween.start();
		cameraPosTween.start();
		sceneRotationTween.start();

		setTimeout(this.boundTweenCamera, intervalTime);
	}

	tweenLight() {
		if (this.lightTween) this.lightTween.stop();
		if (this.lightBackTween) this.lightBackTween.stop();

		let flashTime = 800;
		let origLight = { v: 0.2 };
		let toLight = {
			v: 1
		};

		let light = {
			v: this.light.intensity
		};
		this.lightTween = new TWEEN.Tween(light)
			.to(toLight, flashTime)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onUpdate(() => {
				this.light.intensity = light.v;
			});
		this.lightBackTween = new TWEEN.Tween(light)
			.to(origLight, flashTime)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onUpdate(() => {
				this.light.intensity = light.v;
			});
		this.lightTween.chain(this.lightBackTween);

		this.lightTween.start();
	}

	tweenBackground() {
		if (this.colorTween) this.colorTween.stop();
		if (this.colorBackTween) this.colorBackTween.stop();

		let flashTime = 800;
		let origColor = new THREE.Color(this.color1);
		let toColor = new THREE.Color(this.color2);

		let color = {
			r: this.scene.background.r,
			g: this.scene.background.g,
			b: this.scene.background.b
		};
		this.colorTween = new TWEEN.Tween(color)
			.to(toColor, flashTime)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onUpdate(() => {
				this.scene.background = new THREE.Color(color.r, color.g, color.b);
				this.cube.material.color = new THREE.Color(color.r, color.g, color.b);
			});
		this.colorBackTween = new TWEEN.Tween(color)
			.to(origColor, flashTime)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onUpdate(() => {
				this.scene.background = new THREE.Color(color.r, color.g, color.b);
				this.cube.material.color = new THREE.Color(color.r, color.g, color.b);
			});
		this.colorTween.chain(this.colorBackTween);

		this.colorTween.start();
	}

	createMountain(w, h, y, z, x, isWireframe) {
		let cone = new THREE.Mesh(
			new THREE.ConeGeometry(w, h, 6),
			new THREE.MeshPhongMaterial({
				color: 0xffffff,
				specular: 0x666666,
				emissive: 0x000000,
				shininess: 10,
				opacity: 0.5,
				transparent: true,
				wireframe: isWireframe
			})
		);

		cone.position.x = x;
		cone.position.y = y;
		cone.position.z = z;

		cone.matrixAutoUpdate = false;
		cone.updateMatrix();

		return cone;
	}

	drawMountains() {
		this.scene.add(this.createMountain(400, 400, 199, -200, -500, false));
		this.scene.add(this.createMountain(200, 100, 49, -200, 300, false));
		this.scene.add(this.createMountain(100, 50, 24, -200, 500, false));
		this.scene.add(this.createMountain(100, 50, 24, -200, -500, false));
		this.scene.add(this.createMountain(50, 25, 12, -30, -160, false));

		this.scene.add(this.createMountain(400, 400, 199, -200, -500, true));
		this.scene.add(this.createMountain(200, 100, 49, -200, 300, true));
		this.scene.add(this.createMountain(100, 50, 24, -200, 500, true));
		this.scene.add(this.createMountain(100, 50, 24, -200, -500, true));
		this.scene.add(this.createMountain(50, 25, 12, -30, -160, true));
	}

	drawStars() {
		let starsGeometry = new THREE.Geometry();

		for (let i = 0; i < 10000; i++) {
			let star = new THREE.Vector3();
			star.x = THREE.Math.randFloatSpread(2000);
			star.y = THREE.Math.randFloat(0, 1000);
			star.z = THREE.Math.randFloat(-1000, -400);
			starsGeometry.vertices.push(star);
		}

		let starsMaterial = new THREE.PointsMaterial({ color: 0x888888 });
		let starField = new THREE.Points(starsGeometry, starsMaterial);

		starField.matrixAutoUpdate = false;
		starField.updateMatrix();

		this.scene.add(starField);
	}

	createHorizontalGridLine(z) {
		let gridMaterial = new THREE.LineBasicMaterial({ color: 0xff00da });
		let gridGeo = new THREE.Geometry();
		gridGeo.vertices.push(new THREE.Vector3(-200, 0, 0));
		gridGeo.vertices.push(new THREE.Vector3(200, 0, 0));
		let grid = new THREE.Line(gridGeo, gridMaterial);
		grid.position.z = z;

		return grid;
	}

	drawHorizontalGridLines() {
		let gridLines = [];

		for (let i = -200; i <= 200; i += 10) {
			let line = this.createHorizontalGridLine(i);
			gridLines.push(line);
			this.scene.add(line);
		}

		return gridLines;
	}

	createVerticalGridLine(x) {
		let gridMaterial = new THREE.LineBasicMaterial({ color: 0xff00da });
		let gridGeo = new THREE.Geometry();
		gridGeo.vertices.push(new THREE.Vector3(0, 0, -200));
		gridGeo.vertices.push(new THREE.Vector3(0, 0, 200));
		let grid = new THREE.Line(gridGeo, gridMaterial);
		grid.position.x = x;

		return grid;
	}

	drawVerticalGridLines() {
		for (let i = -200; i <= 200; i += 10) {
			this.scene.add(this.createVerticalGridLine(i));
		}
	}

	drawGrid() {
		this.drawVerticalGridLines();
		return this.drawHorizontalGridLines();
	}

	createWall(x, z) {
		let wallGeo = new THREE.BoxGeometry(1, 100, 30);
		let wallMat = new THREE.MeshPhongMaterial({
			color: 0xfffc00,
			specular: 0x666666,
			emissive: 0x000000,
			shininess: 10,
			opacity: 0.7,
			transparent: true
		});
		let wall = new THREE.Mesh(wallGeo, wallMat);
		wall.position.x = x;
		wall.position.y = 50;
		wall.position.z = z;

		return wall;
	}

	drawLeftWall() {
		let wall = this.createWall(-100, 180);
		this.walls.push(wall);
		this.scene.add(wall);
	}

	drawRightWall() {
		let wall = this.createWall(100, 180);
		this.walls.push(wall);
		this.scene.add(wall);
	}

	drawDome() {
		let group = new THREE.Group();

		let sphereGeo = new THREE.SphereGeometry(50, 32, 32);
		let sphereMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
		this.sphere = new THREE.Mesh(sphereGeo, sphereMat);

		let cubeGeo = new THREE.BoxGeometry(100, 100, 100);
		let cubeMat = new THREE.MeshBasicMaterial({ color: 0 });
		this.cube = new THREE.Mesh(cubeGeo, cubeMat);
		this.cube.position.y -= 50.1;

		group.add(this.sphere);
		group.add(this.cube);

		group.position.z = -1000;

		this.scene.add(group);

		return group;
	}

	animate() {
		if (!this.active) return;

		requestAnimationFrame(this.boundAnimate);
		TWEEN.update();

		let tf = -1 * this.getAttribute("speed");

		for (let i = this.lines.length - 1; i >= 0; i--) {
			this.lines[i].position.z += tf;
			if (this.lines[i].position.z < -200) {
				this.scene.remove(this.lines[i]);
				this.lines.splice(i, 1);
			}
		}

		for (let i = this.grids.length - 1; i >= 0; i--) {
			this.grids[i].position.z += tf;
			if (this.grids[i].position.z < -200) {
				this.grids[i].position.z = 200;
			}
		}

		for (let i = this.walls.length - 1; i >= 0; i--) {
			this.walls[i].position.z += tf * 2;
			if (this.walls[i].position.z < -1000) {
				this.scene.remove(this.walls[i]);
				this.lines.splice(i, 1);
			}
		}

		this.camera.lookAt(this.cameraTarget.position);

		this.dome.position.z += tf;
		if (this.dome.position.z <= -1000) {
			this.dome.position.z = 150;
		}

		this.renderer.render(this.scene, this.camera);
	}

	setBg(invert) {
		if (invert) {
			this.scene.background = new THREE.Color(this.color2);
			this.cube.material.color = new THREE.Color(this.color2);
			this.sphere.material.color = new THREE.Color(this.color1);
		} else {
			this.scene.background = new THREE.Color(this.color1);
			this.cube.material.color = new THREE.Color(this.color1);
			this.sphere.material.color = new THREE.Color(this.color2);
		}

		this.isColor1 = !this.isColor1;
	}

	onScreenUpdated() {
		this.onSelectorUpdated();
	}

	onResize() {
		if (!this.camera || !this.renderer) return;
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	onDestroy() {
		this.active = false;
		clearInterval(this.intervalId);
		window.removeEventListener("resize", this.boundResize);
		if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentElement) {
			this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
		}
	}
}

let h = `<div id="container"></div>`;

let css = `
#container {
	max-width: 13em !important;
	max-height: 13em !important;
}
canvas {
	max-width: 13em !important;
	max-height: 13em !important;
}
`;

export default {
	label: "Lazer Grid",
	text: LazerGrid.toString(),
	templateHTML: h,
	templateCSS: css
};
