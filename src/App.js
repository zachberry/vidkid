import React, { Component } from "react";
// import ReactDOM from "react-dom";
// import logo from "./logo.svg";
import "./App.css";

import Events from "./events";
// import NodeMap from "./node/node-map";
import NodeBoard from "./components/node-board";
import ConnectionsBoard from "./components/connections-board";
import MainMenu from "./components/main-menu";
import DocState from "./doc-state";
import Modal from "./components/modal";
import EditNode from "./components/edit-node";
import Screen from "./components/screen";
import EditPage from "./components/edit-page";
import ImportExportDialog from "./components/import-export-dialog";

// window.addEventListener("gamepadconnected", e => {
// 	console.log("oh shit", e);
// });

// let _wc = `() => { return class WordCount extends HTMLElement {
// 	static get observedAttributes() {
// 		return ["barf"];
// 	}

// 	static get bingBongs() {
// 		return "bing bongs";
// 	}

// 	constructor() {
// 		// Always call super first in constructor
// 		super();

// 		// Element functionality written in here
// 		this.root = this.attachShadow({ mode: "open" });
// 		// this.root.appendChild(templateEl.content);

// 		let p = document.createElement("button");
// 		p.innerText = "THIS IS A PEEEEEEE";
// 		p.onclick = e => {
// 			p.innerText = Date.now();
// 			this.setAttribute("barf", Date.now());
// 		};

// 		this.root.appendChild(p);
// 	}

// 	fn(x) {
// 		this.setAttribute("barf", x);
// 	}

// 	attributeChangedCallback(name, oldValue, newValue) {
// 		console.log("P ATTR CHANGED", name, oldValue, newValue);
// 	}

// 	connectedCallback() {
// 		console.log("CONNN");
// 	}

// 	disconnectedCallback() {
// 		console.log("DISCONN");
// 	}
// }}`;

// let WordCount = eval(_wc)();

// // debugger;

// // class Cheese extends WordCount {}
// customElements.define("word-count", WordCount);
// console.log("WORDCOUNT IS", WordCount);

class App extends Component {
	constructor() {
		super();

		this.docState = new DocState();
		this.docState.onUpdateCallback = this.onUpdate.bind(this);
		window.__ds = this.docState;

		this.state = {
			importExportMode: null
		};

		this.boundSetFullscreen = this.setFullscreen.bind(this);

		document.addEventListener("keyup", this.onKeyUp.bind(this));
	}

	onKeyUp(event) {
		if (this.docState.editingNodeId !== null || this.docState.editingPage) return;
		if (!this.docState.selectedConnection) return;

		if (event.keyCode === 46 || event.keyCode === 8) {
			this.docState.doAction({
				type: "removeSelectedConnection"
			});
		}
	}

	setFullscreen(value) {
		this.docState.doAction({
			type: "setFullscreen",
			value
		});
	}

	onUpdate() {
		localStorage.saved = JSON.stringify(this.docState.toSerializeable());
		this.forceUpdate();
	}

	componentDidMount() {
		if (localStorage.saved) {
			this.fromSerializeable(JSON.parse(localStorage.saved));
		}

		Events.on("app:update", this.forceUpdate.bind(this, null));
		Events.on("toolbar:editPage", this.docState.doAction.bind(this.docState, { type: "editPage" }));
		Events.on("toolbar:initState", this.onToolbarInitState.bind(this));
		Events.on("toolbar:import", this.setState.bind(this, { importExportMode: "import" }, null));
		Events.on("toolbar:export", this.setState.bind(this, { importExportMode: "export" }, null));
		Events.on(
			"importExportDialog:close",
			this.setState.bind(this, { importExportMode: null }, null)
		);
		Events.on("importExportDialog:import", this.onDialogImport.bind(this));
		// Events.on("screen:iframeUpdated", this.restoreNodeMap.bind(this));
		// Events.on("toolbar:initState", this.initState.bind(this));
	}

	onToolbarInitState() {
		this.init();
		this.onUpdate();
	}

	fromSerializeable(newState) {
		//@TODO: Can these two methods be combined?
		this.docState.fromSerializeableNodeMap(newState);
		this.docState.fromSerializeable(newState);

		this.forceUpdate(() => {
			this.onUpdate();

			setTimeout(() => {
				this.forceUpdate();

				//@TODO:
				// let gamepad = require("./library/css-hue-rotate").default;
				// console.log("gp", gamepad);
				// this.docState.doAction({
				// 	type: "createNode",
				// 	text: gamepad.text
				// 	// templateHTML: gamepad.templateHTML,
				// 	// templateCSS: gamepad.templateCSS
				// });
			});
		});

		// this.forceUpdate(() => {
		// 	// this.docState.fromSerializeableNodeMap(newState);
		// 	this.onUpdate();

		// 	setTimeout(() => {
		// 		this.forceUpdate();
		// 	});
		// });
	}

	onDialogImport(newState) {
		// this.docState.fromSerializeable(newState)
		this.setState({
			importExportMode: null
		});
		this.fromSerializeable(newState);
	}

	init() {
		this.docState.init();
		this.forceUpdate();
	}

	render() {
		return (
			<div className="App">
				<MainMenu />
				<div className="edit-board">
					<ConnectionsBoard docState={this.docState} />
					<NodeBoard
						nodeOrder={this.docState.nodeMap.nodeOrder}
						nodes={this.docState.nodeMap.byId}
						values={this.docState.nodeMap.values}
						getAttribute={this.docState.nodeMap.getAttribute.bind(this.docState.nodeMap)}
						docState={this.docState}
						nodeMap={this.docState.nodeMap}
					/>
					<Screen
						pageHTML={this.docState.pageHTML}
						pageCSS={this.docState.pageCSS}
						fullscreen={this.docState.fullscreen}
						setFullscreen={this.boundSetFullscreen}
					/>
				</div>
				{this.docState.editingNodeId !== null ? (
					<Modal>
						<EditNode docState={this.docState} nodeId={this.docState.editingNodeId} />
					</Modal>
				) : null}
				{this.docState.editingPage ? (
					<Modal>
						<EditPage
							docState={this.docState}
							html={this.docState.pageHTML}
							css={this.docState.pageCSS}
						/>
					</Modal>
				) : null}
				{this.state.importExportMode !== null ? (
					<Modal>
						<ImportExportDialog
							mode={this.state.importExportMode}
							text={
								this.state.importExportMode === "export"
									? JSON.stringify(this.docState.toSerializeable())
									: null
							}
						/>
					</Modal>
				) : null}
			</div>
		);
	}
}

export default App;
