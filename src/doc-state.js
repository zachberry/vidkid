import clone from "clone";

// CLOSE ENCOUNTERS

import NodeMap from "./node/node-map";
// import HardwareMap from './hardware-map';
// import Node from "./node";
import Events from "./events";

class DocState {
	constructor(hardware) {
		this.nodeMap = new NodeMap(this);

		this.init();

		this._onUpdateCallback = () => {};
	}

	init() {
		this.shouldDisplayUpdate = true;
		this.view = DocState.VIEW_EDIT;
		this.editingNodeId = null;
		this.editingPage = false;
		this.selectedConnection = null;
		this.isCablesMuted = false;
		this.nodeUIMap = {};
		this.pageHTML = `<body>

</body>`;
		this.pageCSS = `body {
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
	font-size: 14pt;
	font-family: Arial, Helvetica, sans-serif;
	color: white;
	background: black;
}`;
		this.connecting = null;
		this.updatingNodeId = null;
		this.scenes = ["Stage", "Scene 1", "Component 1", "Controller 1", "Controller: Keypad"];
		this.fullscreen = false;
		this.zoomLevel = 1;
		this.nodeMap.init();
	}

	isNodeNotUpdating(nodeId) {
		return this.updatingNodeId !== null && this.updatingNodeId !== nodeId;
	}

	update() {
		this._onUpdateCallback();
	}

	toSerializable() {
		let o = clone({
			editingNodeId: this.editingNodeId,
			editingPage: this.editingPage,
			selectedConnection: this.selectedConnection,
			connecting: this.connecting,
			pageHTML: this.pageHTML,
			pageCSS: this.pageCSS,
			nodeUIMap: this.nodeUIMap,
			isCablesMuted: this.isCablesMuted,
			fullscreen: this.fullscreen,
			zoomLevel: this.zoomLevel
		});

		o.nodeMap = this.nodeMap.toSerializable();

		return o;
	}

	fromSerializable(o) {
		this.editingNodeId = o.editingNodeId;
		this.connecting = o.connecting;
		this.editingPage = o.editingPage;
		this.selectedConnection = o.selectedConnection;
		this.pageHTML = o.pageHTML;
		this.pageCSS = o.pageCSS;
		this.nodeUIMap = o.nodeUIMap;
		this.isCablesMuted = o.isCablesMuted;
		this.fullscreen = o.fullscreen;
		this.zoomLevel = o.zoomLevel;
	}

	// This function is split off since nodes could reference page elements
	// and the page may not be built by the time this is being recreated
	// from a saved state!
	fromSerializableNodeMap(o) {
		this.nodeMap.fromSerializable(o.nodeMap);
	}

	set onUpdateCallback(fn) {
		this._onUpdateCallback = fn;
	}

	// Since we set input values very often this is a faster method
	// to shortcut having to create an object
	setAttribute(nodeId, attrName, value, applyUserTransformIfAvailable) {
		this.nodeMap.setAttribute(nodeId, attrName, value, applyUserTransformIfAvailable);

		this.update();
	}

	setNodePosition(nodeId, x, y) {
		if (!this.nodeUIMap[nodeId]) this.nodeUIMap[nodeId] = {};
		if (!this.nodeUIMap[nodeId].pos) this.nodeUIMap[nodeId].pos = [];

		this.nodeUIMap[nodeId].pos = [x, y];
	}

	getNodePosition(nodeId) {
		if (!this.nodeUIMap[nodeId] || !this.nodeUIMap[nodeId].pos) return [0, 0];
		return this.nodeUIMap[nodeId].pos;
	}

	isInputUIOpen(type, nodeId, inputName) {
		return Boolean(
			this.nodeUIMap[nodeId] &&
				this.nodeUIMap[nodeId][type] &&
				this.nodeUIMap[nodeId][type][inputName] === true
		);
	}

	openInputUI(type, nodeId, inputName) {
		if (!this.nodeUIMap[nodeId]) this.nodeUIMap[nodeId] = {};
		if (!this.nodeUIMap[nodeId][type]) this.nodeUIMap[nodeId][type] = {};

		this.nodeUIMap[nodeId][type][inputName] = true;
	}

	closeInputUI(type, nodeId, inputName) {
		if (!this.nodeUIMap[nodeId] || !this.nodeUIMap[nodeId][type]) return;

		delete this.nodeUIMap[nodeId][type][inputName];

		if (Object.keys(this.nodeUIMap[nodeId][type]).length === 0) {
			delete this.nodeUIMap[nodeId][type];
		}
		if (Object.keys(this.nodeUIMap[nodeId]).length === 0) {
			delete this.nodeUIMap[nodeId];
		}
	}

	doAction(action) {
		let error = null;

		let backup = this.toSerializable();

		this.updatingNodeId = null;

		try {
			switch (action.type) {
				case "setMutedCables":
					this.isCablesMuted = action.value;
					break;

				case "setView":
					this.view = action.value;
					break;

				case "setFullscreen":
					this.fullscreen = action.value;
					this.shouldDisplayUpdate = !action.value;
					break;

				case "createNode":
					let newNode = this.nodeMap.createNewNode(
						action.text,
						action.templateHTML,
						action.templateCSS
					);
					if (action.x || action.y) {
						this.setNodePosition(newNode.id, action.x, action.y);
					}
					break;

				case "moveNode":
					this.setNodePosition(action.id, action.x, action.y);
					break;

				case "removeNode":
					this.nodeMap.removeNode(action.id);
					break;

				case "moveNodeToTop":
					this.nodeMap.moveNodeToTop(action.id);
					break;

				case "copyNode":
					let clone = this.nodeMap.cloneNode(action.id);
					let pos = this.getNodePosition(action.id);
					this.setNodePosition(clone.id, pos[0] + 20, pos[1] + 20);
					break;

				case "openInputControl":
					this.openInputUI("control", action.id, action.name);
					break;

				case "closeInputControl":
					this.closeInputUI("control", action.id, action.name);
					break;

				case "openInputUserTransform":
					this.openInputUI("userTransform", action.id, action.name);
					this.isCablesMuted = true;
					break;

				case "closeInputUserTransform":
					this.closeInputUI("userTransform", action.id, action.name);
					this.isCablesMuted = false;
					break;

				case "setTransform":
					let isSuccessful = this.nodeMap.setUserTransform(action.id, action.name, action.text);
					if (isSuccessful) this.closeInputUI("userTransform", action.id, action.name);
					break;

				case "removeConnection":
					this.nodeMap.disconnect(
						action.fromNodeId,
						action.fromOutputIndex,
						action.toNodeId,
						action.toInputIndex
					);
					break;

				case "selectConnection":
					this.selectedConnection = {
						from: action.from,
						to: action.to
					};
					break;

				case "removeSelectedConnection":
					if (!this.selectedConnection) return;

					this.nodeMap.disconnect(this.selectedConnection.from, this.selectedConnection.to);
					this.selectedConnection = null;
					break;

				case "unselectConnection":
					this.selectedConnection = null;
					break;

				case "editNode":
					this.editingNodeId = action.id; //this.nodeMap.getNodeById(action.id);
					break;

				case "updateNodeText":
					if (this.editingNodeId === null) return;

					this.nodeMap.editNode(
						this.editingNodeId,
						action.text,
						action.templateHTML,
						action.templateCSS
					);

					break;

				case "stopEditingNode":
					this.editingNodeId = null;
					break;

				case "editPage":
					this.editingPage = true;
					break;

				case "updatePage":
					this.pageHTML = action.html;
					this.pageCSS = action.css;
					break;

				case "stopEditingPage":
					this.editingPage = false;
					break;

				case "connect":
					let inConnection;
					let outConnection;

					if (this.connecting === null || this.connecting.portType === action.portType) {
						//@if ports had unique ids wouldn't need to specify so much data
						this.connecting = {
							portType: action.portType,
							id: action.id,
							name: action.name
						};

						break;
					}

					switch (action.portType) {
						case "input":
							inConnection = action;
							outConnection = this.connecting;
							break;

						case "output":
							inConnection = this.connecting;
							outConnection = action;
							break;

						default:
							return false;
					}

					this.nodeMap.connect(
						outConnection.id,
						outConnection.name,
						inConnection.id,
						inConnection.name
					);

					this.connecting = null;

					break;

				case "abortConnection":
					this.connecting = null;
					break;

				case "setZoomLevel":
					this.zoomLevel = action.zoomLevel;
					break;

				default:
					return false;
			}
		} catch (e) {
			console.error("CAUGHT ERROR");
			console.error(e);

			error = e;

			Events.emit("app:error", e.message);

			this.fromSerializable(backup);
		}

		this.update(error || true);
		this.updatingNodeId = null;

		return error || true;
	}
}

export default DocState;
