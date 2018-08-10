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
import ErrorMessage from "./components/error-message";
import drag from "./util/drag";
import ZoomControls from "./components/zoom-controls";

class App extends Component {
	constructor() {
		super();

		this.docState = new DocState();
		this.docState.onUpdateCallback = this.onUpdate.bind(this);
		window.__ds = this.docState;

		this.state = {
			importExportMode: null,
			bgX: 0,
			bgY: 0
		};

		this.boundSetFullscreen = this.setFullscreen.bind(this);
		this.boundOnDragNodeBoard = this.onDragNodeBoard.bind(this);
		// this.boundOnStartDragEditBoard = this.onStartDragEditBoard.bind(this);
		this.boundOnZoomIn = this.onZoomIn.bind(this);
		this.boundOnZoomOut = this.onZoomOut.bind(this);

		document.addEventListener("keyup", this.onKeyUp.bind(this));
		window.addEventListener("error", this.onGlobalError.bind(this));
	}

	// onStartDragEditBoard() {
	// 	drag(this.refs.editBoard, this.boundonDragNodeBoard);
	// }

	onDragNodeBoard(el, pt, newLocation, dragData, moveByPt, restrictedDimensions, event) {
		console.log(pt, newLocation);
		Events.emit("cable:update");
		this.setState({
			bgX: newLocation.x,
			bgY: newLocation.y
		});
	}

	onGlobalError(event) {
		console.error(event);
		Events.emit("app:error", event.message);
	}

	getImportFromHash() {
		const h = "" + window.location.hash.replace("#", "");
		if (h.length === 0) return null;
		try {
			const doc = JSON.parse(atob(h));
			return doc;
		} catch (e) {}

		return null;
	}

	shouldComponentUpdate() {
		return this.docState.shouldDisplayUpdate;
	}

	onKeyUp(event) {
		if (this.docState.fullscreen && event.keyCode === 27) {
			this.setFullscreen(false);
		}
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
		console.log("upendaten");
		localStorage.saved = JSON.stringify(this.docState.toSerializable());
		this.forceUpdate();
	}

	componentDidMount() {
		let docFromHash = this.getImportFromHash();
		if (docFromHash) {
			this.fromSerializable(docFromHash);
		} else if (localStorage.saved) {
			this.fromSerializable(JSON.parse(localStorage.saved));
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
		Events.on("app:error", this.onErrorMessage.bind(this));
		// Events.on("screen:iframeUpdated", this.restoreNodeMap.bind(this));
		// Events.on("toolbar:initState", this.initState.bind(this));
	}

	onErrorMessage(message) {
		console.error("App:error");
		console.error(message);
		this.setState({ errorMessage: message, errorMessageTime: Date.now() });
	}

	onDismissError() {
		this.setState({ errorMessage: null });
	}

	onToolbarInitState() {
		this.init();
		this.onUpdate();
	}

	fromSerializable(newState) {
		// This will restore screen
		this.docState.fromSerializable(newState);

		this.forceUpdate(() => {
			// Need to defer this until this point since only here
			// can we ensure that screen has been rendered and nodes
			// can call screen in any onAttrChangeds
			this.docState.fromSerializableNodeMap(newState);
			this.onUpdate();

			setTimeout(() => {
				this.forceUpdate();

				//@TODO:
				let gamepad = require("./library/audio-device").default;
				console.log("gp", gamepad);
				// this.docState.doAction({
				// 	type: "createNode",
				// 	text: gamepad.text,
				// 	templateHTML: gamepad.templateHTML
				// 	// templateCSS: gamepad.templateCSS
				// });
			});
		});

		// this.forceUpdate(() => {
		// 	// this.docState.fromSerializableNodeMap(newState);
		// 	this.onUpdate();

		// 	setTimeout(() => {
		// 		this.forceUpdate();
		// 	});
		// });
	}

	onDialogImport(newState) {
		// this.docState.fromSerializable(newState)
		this.setState({
			importExportMode: null
		});
		this.fromSerializable(newState);
	}

	init() {
		this.docState.init();
		this.forceUpdate();
	}

	componentDidCatch(error, info) {
		this.setState({
			errorMessage: error.message
		});
	}

	onZoomIn() {
		this.docState.doAction({
			type: "setZoomLevel",
			zoomLevel: this.docState.zoomLevel + 0.2
		});
	}

	onZoomOut() {
		this.docState.doAction({
			type: "setZoomLevel",
			zoomLevel: this.docState.zoomLevel - 0.2
		});
	}

	render() {
		return (
			<div className="App">
				<MainMenu />
				<div
					className="edit-board"
					ref="editBoard"
					style={{ backgroundPositionX: this.state.bgX, backgroundPositionY: this.state.bgY }}
				>
					<ConnectionsBoard
						docState={this.docState}
						isConnecting={this.docState.connecting !== null}
					/>
					<NodeBoard
						nodeOrder={this.docState.nodeMap.nodeOrder}
						nodes={this.docState.nodeMap.byId}
						values={this.docState.nodeMap.values}
						getAttribute={this.docState.nodeMap.getAttribute.bind(this.docState.nodeMap)}
						docState={this.docState}
						nodeMap={this.docState.nodeMap}
						connectingType={this.docState.connecting ? this.docState.connecting.portType : null}
						onDragBoard={this.boundOnDragNodeBoard}
					/>
				</div>
				<Screen
					pageHTML={this.docState.pageHTML}
					pageCSS={this.docState.pageCSS}
					fullscreen={this.docState.fullscreen}
					setFullscreen={this.boundSetFullscreen}
					docState={this.docState}
				/>
				<ZoomControls onZoomIn={this.boundOnZoomIn} onZoomOut={this.boundOnZoomOut} />
				{this.docState.editingNodeId !== null &&
				this.docState.nodeMap.byId[this.docState.editingNodeId] ? (
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
									? JSON.stringify(this.docState.toSerializable())
									: null
							}
						/>
					</Modal>
				) : null}
				{this.state.errorMessage ? (
					<ErrorMessage
						message={this.state.errorMessage}
						time={this.state.errorMessageTime}
						onDismiss={this.onDismissError.bind(this)}
					/>
				) : null}
			</div>
		);
	}
}

export default App;
