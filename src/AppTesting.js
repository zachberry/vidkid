import "../node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter";

import React, { Component } from "react";
import ReactDOM from "react-dom";
import logo from "./logo.svg";
import "./App.css";

class ZachHTMLElement extends HTMLElement {
	static get observedAttributes() {
		return ["name"];
	}

	constructor(events) {
		super();
		this.events = events;
		console.log("con args", arguments);
		// super();

		// console.log('THREE', THREE)

		this.shadow = this.attachShadow({ mode: "open" });

		// this.shadow.appendChild(templateEl.content.cloneNode(true))

		let div = document.createElement("div");
		div.id = "div";
		div.innerText = "howdy";
		this.shadow.appendChild(div);
		// this.style = document.createElement('style');
		// this.style.textContent = `
		// 	div {cv
		// 		border: 1px solid red;
		// 	}
		// `
		// shadow.appendChild(this.style);

		// this.div = document.createElement('div');
		// let t = document.createTextNode('Custom Thing!')
		// this.div.appendChild(t)
		// shadow.appendChild(this.div);

		console.log("window is", window);
		console.log("I SEE", window.THREE);

		this.cheese = "dog";
		console.log("inputs be all", this.inputs);

		this.boundMouseMove = this.onMouseMove.bind(this);
	}

	send(outputName, value) {
		console.log("send", outputName, value);
	}

	onMouseMove(e) {
		console.log(e);
		let attachedto = this.getAttribute("attachedto");
		if (attachedto) {
			let el = document.getElementById(attachedto);
			if (el) el.setAttribute("name", e.clientX);
		}

		//this.events.send(e.clientX)
	}

	connectedCallback() {
		window.addEventListener("mouseup", this.boundMouseMove);
	}

	disconnectedCallback() {
		window.removeEventListener("mouseup", this.boundMouseMove);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		console.log("this", this.shadow);
		this.shadow.getElementById("div").innerText = oldValue + "->" + newValue;
	}
}

customElements.define("zach-el", ZachHTMLElement);

class Node extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: "MyComp"
		};
	}
	componentDidMount() {
		let z = new this.props.child();
		z.id = "n0";
		ReactDOM.findDOMNode(this).appendChild(z);
	}

	onClick(event) {
		this.setState({
			name: "Updated"
		});
	}

	render() {
		return (
			<div style={{ border: "2px solid blue" }}>
				<h1>{this.state.name + this.props.counter}</h1>
				<button onClick={this.onClick.bind(this)}>Update</button>
			</div>
		);
	}
}

class App extends Component {
	constructor() {
		super();

		this.state = {
			counter: 0
		};
	}
	componentDidMount() {
		window.THREE = "my loaded library";

		let events = {
			send: value => {
				let screen = document.getElementById("screen");
				screen.contentWindow.document.getElementById("box").textContent = value;
			}
		};
		let d = new ZachHTMLElement(events);
		d.id = "n0";
		console.log("d", d);
		// document.body.appendChild(d)

		let iframe = document.getElementById("board");
		iframe.contentWindow.document.body.appendChild(d);

		let b = document.createElement("div");
		b.innerText = "BOX";
		b.id = "box";
		b.style.border = "1px solid red";
		let screen = document.getElementById("screen");
		screen.contentWindow.document.body.appendChild(b);
	}

	updateCounter() {
		this.setState({
			counter: this.state.counter + 1
		});
		document.getElementById("n0").setAttribute("name", this.state.counter + 1);
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to React</h1>
					{/* <zach-el></zach-el> */}
				</header>
				<p className="App-intro">
					To get started, edit <code>src/App.js</code> and save to reload.
				</p>
				<Node counter={this.state.counter} child={ZachHTMLElement} />
				<button onClick={this.updateCounter.bind(this)}>Counter</button>
				<iframe id="board" />
				<iframe id="screen" />
			</div>
		);
	}
}

export default App;
