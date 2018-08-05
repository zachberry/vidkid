import clone from "clone";

// CLOSE ENCOUNTERS

import NodeMap from "./node/node-map";
// import HardwareMap from './hardware-map';
// import Node from "./node";
import Events from "./events";

class DocState {
	constructor(hardware) {
		//@TODO
		//this.hardware = hardware;
		this.hardware = {
			disable: () => {},
			enable: () => {}
		};

		this.nodeMap = new NodeMap(this);
		// this.hardwareMap = new HardwareMap(hardware, this.nodeMap)

		this.init();
		// this.stateHistory = [this.toSerializable()]
		// this.historyPtr = null

		this._onUpdateCallback = () => {};
	}

	init() {
		this.shouldDisplayUpdate = true;
		this.view = DocState.VIEW_EDIT;
		// this.modal = null;
		this.editingNodeId = null;
		this.editingPage = false;
		this.selectedConnection = null;
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
		// this.screen;
		this.nodeMap.init();
		// this.hardwareMap.init()
	}

	isNodeNotUpdating(nodeId) {
		return this.updatingNodeId !== null && this.updatingNodeId !== nodeId;
	}

	// undo() {
	// 	if (this.historyPtr === null)
	// 	{
	// 		this.historyPtr = this.stateHistory.length
	// 	}

	// 	this.historyPtr--

	// 	this.fromSerializable
	// }

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
			fullscreen: this.fullscreen
		});

		o.nodeMap = this.nodeMap.toSerializable();

		return o;
	}

	fromSerializable(o) {
		console.log("STATE FS", o);
		this.editingNodeId = o.editingNodeId;
		this.connecting = o.connecting;
		this.editingPage = o.editingPage;
		this.selectedConnection = o.selectedConnection;
		this.pageHTML = o.pageHTML;
		this.pageCSS = o.pageCSS;
		this.nodeUIMap = o.nodeUIMap;
		this.fullscreen = o.fullscreen;
		//this.nodeMap.fromSerializable(o.nodeMap);
		// this.hardwareMap.fromSerializable(o.hardwareMap)

		// console.log('new state', this.nodeMap)

		// this.update()
	}

	// This function is split off since nodes could reference page elements
	// and the page may not be built by the time this is being recreated
	// from a saved state!
	fromSerializableNodeMap(o) {
		console.log("FSNM", o);
		this.nodeMap.fromSerializable(o.nodeMap);
	}

	set onUpdateCallback(fn) {
		this._onUpdateCallback = fn;
	}

	// toObject() { //@TODO rename?
	// 	return this._state;
	// }

	// Since we set input values very often this is a faster method
	// to shortcut having to create an object
	setAttribute(nodeId, attrName, value, applyUserTransformIfAvailable) {
		// this.updatingNodeId = nodeId;
		// this.nodeMap.setInputValue(nodeId, portIndex, value, applyTransform);
		// this.update();
		// this.updatingNodeId = null;
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
		console.log("opren");
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

	todo_forceAllNodesToRun() {
		//@TODO: I think this could be problematic since
		//INCREMENT would increment when re-ran
		// debugger
		for (let id in this.nodeMap.nodesInstancesById) {
			let node = this.nodeMap.nodesInstancesById[id];
			console.log("run", node.id, this.nodeMap.inputValues[node.id]);
			node.sendAll(this.nodeMap.inputValues[node.id]);
		}
	}

	doAction(action) {
		console.log("DO ACTION", action);
		let error = null;

		let backup = this.toSerializable();
		// console.log('BACK BE ALL', backup)

		this.updatingNodeId = null;

		try {
			//console.log('DO ACTION', action)
			switch (action.type) {
				case "toggleView":
					this.view =
						this.view === DocState.VIEW_EDIT ? DocState.VIEW_PERFORMANCE : DocState.VIEW_EDIT;
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
						// this.nodeMap.setNodePositionById(newNode.id, action.x, action.y);
						this.setNodePosition(newNode.id, action.x, action.y);
					}
					break;

				case "moveNode":
					//this.nodeMap.setNodePositionById(action.id, action.x, action.y);
					this.setNodePosition(action.id, action.x, action.y);
					break;

				case "removeNode":
					// this.hardwareMap.disconnectAllForNode(action.id)
					this.nodeMap.removeNode(action.id);
					break;

				case "moveNodeToTop":
					this.nodeMap.moveNodeToTop(action.id);
					break;

				case "copyNode":
					// let pos = this.nodeMap.getNodePositionById(action.id);
					let clone = this.nodeMap.cloneNode(action.id);
					let pos = this.getNodePosition(action.id);
					this.setNodePosition(clone.id, pos[0] + 20, pos[1] + 20);
					// this.nodeMap.setNodePositionById(clone.id, pos[0] + 10, pos[1] + 10);
					break;

				case "openInputControl":
					// this.toggleControl(action.id, action.portIndex);
					this.openInputUI("control", action.id, action.name);
					break;

				case "closeInputControl":
					this.closeInputUI("control", action.id, action.name);
					break;

				case "openInputUserTransform":
					this.openInputUI("userTransform", action.id, action.name);
					break;

				case "closeInputUserTransform":
					this.closeInputUI("userTransform", action.id, action.name);
					break;

				// case "toggleTransform":
				// 	this.nodeMap.toggleTransform(action.id, action.portIndex);
				// 	break;

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

					// debugger

					this.nodeMap.disconnect(this.selectedConnection.from, this.selectedConnection.to);
					this.selectedConnection = null;
					break;

				case "unselectConnection":
					this.selectedConnection = null;
					break;

				case "editNode":
					this.hardware.disable();
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
					this.hardware.enable();
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

				case "setNodeProp":
					this.nodeMap.setNodePropById(action.id, action.name, action.value);
					break;

				// case 'runNode':
				// 	// this.nodeMap.nodesInstancesById[action.id].runAndSend()
				// 	this.nodeMap.getNodeById(action.id).runAndSend()
				// 	break;

				// This forces the node to recieve something, meaning
				// it sets the input value AND executes onInput
				// case "recieveValue":
				// 	this.nodeMap
				// 		.getNodeById(action.id)
				// 		.recieve(action.portIndex, action.value, action.applyTransform);
				// 	break;

				// This only sets a value but doesn't execut anything
				// case 'setInputValue':
				// 	console.log('wowee zowee')
				// 	this.updatingNodeId = action.id

				// 	this.nodeMap.setInputValue(action.id, action.portIndex, action.value, action.applyTransform)

				// 	break;

				case "setInputValues":
					this.nodeMap.setInputValues(action.id, action.values);

					break;

				////case 'setHardwareListenerAddress':
				////	this.nodeMap.setHardwareListenerAddress(action.id, action.address);
				////	break;

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

					//console.log('CON', this.connecting, action);

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

				default:
					return false;
			}

			// this.stateHistory.push(this.toSerializable())
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

	// update(newProps) {
	// 	Object.assign(this._state, newProps)
	// 	this._onUpdateCallback()
	// }
}

DocState.VIEW_EDIT = "editView";
DocState.VIEW_PERFORMANCE = "performanceView";

// let state = new State();

// window.__state = state;

export default DocState;
