import clone from "clone";

import NodeMapAdapter from "./node-map-adapter";
import createNodeWebComponent from "../node/create-node-web-component";
import Events from "../events";

const DEFAULT_INPUT_OPTIONS = {
	label: null,
	restrict: null,
	observe: false,
	visible: true
};

export default class NodeMap {
	constructor() {
		this.init();
		this.nodeMapAdapter = new NodeMapAdapter(this);
	}

	init() {
		this.nodeMap = {};
		this.portMap = {};
		this.inputsMap = {};
		this.values = {};
		this.nextId = 0;
		this.byId = {};
		this.nodeOrder = [];
	}

	toSerializeable() {
		let byIdClone = {};
		for (let id in this.byId) {
			let o = this.byId[id];

			// debugger;

			byIdClone[id] = {
				id: id,
				rev: o.rev,
				text: o.text,
				templateHTML: o.templateHTML,
				templateCSS: o.templateCSS,
				transforms: clone(o.transforms)
			};
		}

		let o = clone({
			nodeMap: this.nodeMap,
			portMap: this.portMap,
			inputsMap: this.inputsMap,
			values: this.values,
			nextId: this.nextId,
			nodeOrder: this.nodeOrder
		});

		o.byId = byIdClone;

		return o;
	}

	fromSerializeable(o) {
		this.init();

		// debugger;

		this.values = o.values;
		this.nodeMap = o.nodeMap;
		this.portMap = o.portMap;
		this.inputsMap = o.inputsMap;
		this.nextId = o.nextId;

		for (let id in o.byId) {
			let n = o.byId[id];
			this.createNewNode(n.text, n.templateHTML, n.templateCSS, n.id, n.rev, n.transforms);
		}
	}

	getNextId() {
		return "n" + this.nextId++;
	}

	createNewNode(
		nodeText,
		templateHTML = null,
		templateCSS = null,
		setNodeId = null,
		setRevId = null,
		transforms = null
	) {
		let nodeId = setNodeId !== null ? setNodeId : this.getNextId();
		let rev = setRevId !== null ? setRevId : 0;

		let webComponentTagName = nodeId + "-" + rev + "-" + Date.now();

		let created = createNodeWebComponent(webComponentTagName, nodeText, templateHTML, templateCSS);
		if (created.isError) {
			console.error(created.error);
			throw created.error;
		}
		let webComponent = created.component;
		let templateEl = created.template;
		let styleEl = created.style;
		// debugger;

		let inputs = {};
		// debugger;
		webComponent.inputs.forEach(input => {
			//Create the input object
			inputs[input.name] = Object.assign({}, DEFAULT_INPUT_OPTIONS, input);
		});

		this.byId[nodeId] = {
			id: nodeId,
			rev: rev,
			component: webComponent,
			componentInstance: null,
			text: nodeText,
			templateHTML: templateHTML,
			templateCSS: templateCSS,
			inputs,
			inputsList: Object.values(inputs),
			outputs: webComponent.outputs || [],
			tagName: webComponentTagName,
			transforms: {},
			transformFns: {},
			initialValues: {}
		};
		this.nodeOrder.push(nodeId);

		// Transforms:
		for (let inputName in transforms) {
			this.setUserTransform(nodeId, inputName, transforms[inputName]);
		}

		// Create web component:
		let inst = new this.byId[nodeId].component();
		inst.init(nodeId, this.nodeMapAdapter, templateEl, styleEl);
		this.byId[nodeId].componentInstance = inst;

		// this.refs.component.init(this.props.node.id, this.props.nodeMapAdapter, templateEl);

		// let observer = new MutationObserver(this.onAttrMutation);
		// observer.forNodeId = observer.observe(webComponent, {
		// 	childList: false,
		// 	attributes: true,
		// 	subtree: false
		// });

		// Set values:
		console.log("__setting values__", nodeId, JSON.stringify(this.values, null, 2));
		webComponent.inputs.forEach(input => {
			let value = undefined;
			// If the value is already set (from a fromSerializable operation...)
			if (this.isAttributeSet(nodeId, input.name)) {
				console.log("attr already set");
				value = this.getAttribute(nodeId, input.name);
			}
			// Else if there is a default value...
			else if (typeof input.defaultValue !== "undefined") {
				console.log("default value");
				value = input.defaultValue;
			}

			console.log("value=", value);
			if (value !== undefined) {
				//this.setAttribute(nodeId, input.name, value, false);
				this.byId[nodeId].initialValues[input.name] = value;
			}
		});

		return this.byId[nodeId];
	}

	// This method should be called after the component has been
	// attached to the DOM. Then any attributeChanged callbacks
	// that would be fired can expect the readyCallback
	// to have been called.
	setInitialValues(nodeId) {
		let node = this.byId[nodeId];

		if (!node || !node.initialValues) return;

		console.log("SIV", nodeId, node.initialValues);

		delete this.values[nodeId];

		for (let k in node.initialValues) {
			console.log("set attr", nodeId, k, node.initialValues[k]);
			this.setAttribute(nodeId, k, node.initialValues[k]);
		}

		Events.emit("app:update");
	}

	// This is called from the React component wrapper once the component
	// is actually created so that nodeMap has a reference to it
	// setComponentInstance(nodeId, componentInstance) {
	// 	let node = this.byId[nodeId];
	// 	if (!node) return;

	// 	node.componentInstance = componentInstance;

	// 	// Update values:
	// 	node.component.inputs.forEach(input => {
	// 		console.log(
	// 			"SET INPUT NOW",
	// 			"input.name=",
	// 			input.name,
	// 			"input.defaultValue=",
	// 			input.defaultValue,
	// 			"this.getAttribute=",
	// 			this.getAttribute(nodeId, input.name)
	// 		);
	// 		//Set the value
	// 		let value = undefined;
	// 		// If the value is already set (from a fromSerializable operation...)
	// 		if (this.isAttributeSet(nodeId, input.name)) {
	// 			value = this.getAttribute(nodeId, input.name);
	// 		}
	// 		// Else if there is a default value...
	// 		else if (typeof input.defaultValue !== "undefined") {
	// 			value = input.defaultValue;
	// 		}

	// 		if (value !== undefined) {
	// 			this.setAttribute(node.id, input.name, value, false);
	// 		}
	// 	});

	// 	// Default values:
	// 	//@TODO - SKRIP SKRIP SKIRP!!!!!!
	// 	// webComponent.inputs.forEach(input => {
	// 	// 	if (typeof input.defaultValue !== "undefined") {
	// 	// 		this.setAttribute(nodeId, input.name, input.defaultValue);
	// 	// 	}
	// 	// });
	// }

	cloneNode(nodeId) {
		let node = this.byId[nodeId];
		if (!node) return;

		return this.createNewNode(
			node.text,
			node.templateHTML,
			node.templateCSS,
			null,
			null,
			node.transforms
		);
	}

	// onAttrMutation(mutationList, observer) {
	// 	let mutation = mutationList[0];
	// 	if (!mutation) return;

	// 	let attrVal = mutation.target.getAttribute(mutation.attributeName);
	// 	let inputVal = this.getAttribute(NODEID, mutation.attributeName);

	// 	if (attrVal !== inputVal) {
	// 		this.setInputValue(nodeId, mutation.attributeName, attrVal, false);
	// 	}
	// }

	editNode(nodeId, nodeText, nodeTemplateHTML = null, nodeTemplateCSS = null) {
		// Create a backup:
		let backup = this.toSerializeable();

		try {
			// 1. Store connections and values and transforms
			// 2. Destroy old node
			// 3. Recreate new node
			// 4. Reconnect connections that are still there
			// 5. Set attributes back to component

			let rev = this.byId[nodeId].rev;
			let inputConnections = this.getNodesInputConnections(nodeId);
			let outputConnections = this.getNodesOutputConnections(nodeId);
			// let values = [];
			// for (let k in this.values[nodeId]) {
			// 	values[k] = this.values[nodeId][k];
			// }
			let transforms = clone(this.byId[nodeId].transforms);

			this.removeNode(nodeId, false);
			this.createNewNode(nodeText, nodeTemplateHTML, nodeTemplateCSS, nodeId, rev + 1, transforms);

			let node = this.byId[nodeId];

			inputConnections.forEach(connection => {
				let from = this.getParsedAddress(connection[0]);
				let to = this.getParsedAddress(connection[1]);
				if (to[0] === nodeId && node.inputs[to[1]]) {
					this.connect(
						from[0],
						from[1],
						to[0],
						to[1]
					);
				}
			});
			outputConnections.forEach(connection => {
				let from = this.getParsedAddress(connection[0]);
				let to = this.getParsedAddress(connection[1]);
				if (from[0] === nodeId && node.outputs.indexOf(from[1]) > -1) {
					this.connect(
						from[0],
						from[1],
						to[0],
						to[1]
					);
				}
			});
		} catch (e) {
			console.log("BACKING UP!");
			this.fromSerializeable(backup);
			Events.emit("app:error", e.message);
		}
	}

	runScreenDestroyCallbacks() {
		for (let nodeId in this.byId) {
			let node = this.byId[nodeId];
			node.componentInstance.screenDestroyCallback();
		}
	}

	runScreenUpdatedCallbacks() {
		for (let nodeId in this.byId) {
			let node = this.byId[nodeId];
			node.componentInstance.screenUpdatedCallback();
		}
	}

	setUserTransform(nodeId, inputName, text) {
		if (!this.byId[nodeId]) return false;

		let node = this.byId[nodeId];

		if (text === "") {
			delete node.transforms[inputName];
			delete node.transformFns[inputName];

			return true;
		}

		try {
			let fn = eval(/*eslint-disable-line no-eval*/ `(x) => ${text}`);
			if (typeof fn !== "function") throw new Error(`"${text}" was unable to be parsed!`);

			node.transforms[inputName] = text;
			node.transformFns[inputName] = fn;
		} catch (e) {
			Events.emit("app:error", e.message);
			return false;
		}

		return true;
	}

	moveNodeToTop(nodeId) {
		if (!this.byId[nodeId]) return;

		this.nodeOrder.splice(this.nodeOrder.indexOf(nodeId), 1);
		this.nodeOrder.push(nodeId);
	}

	// deleteValues = false is useful when editing a node.
	// The node can be removed and recreated but the values
	// can persist so that they can be used again.
	removeNode(nodeId, deleteValues = true) {
		let node = this.byId[nodeId];
		if (!node) return;

		this.getNodesConnections(nodeId).forEach(connection => {
			this.disconnect(connection[0], connection[1]);
		});

		// Ensure that the disconnectedCallback is called on the web component:
		// node.component.parentElement.removeChild(node.component);

		delete this.byId[nodeId];
		this.nodeOrder.splice(this.nodeOrder.indexOf(nodeId), 1);
		if (deleteValues) delete this.values[nodeId];
	}

	getAddress(nodeId, attrName) {
		return nodeId + "." + attrName;
	}

	getParsedAddress(addr) {
		return addr.split(".");
	}

	//@TODO: The cycle problem doesn't exist if the target attr
	//is not being observed. To be smarter could check the observed
	//property and allow it if false.
	isConnected(startNodeId, targetNodeId) {
		if (startNodeId === targetNodeId) return true;

		if (!this.nodeMap[startNodeId]) return false;

		let nodeIdsToCheck = [...Object.keys(this.nodeMap[startNodeId])];
		let nodeIdsChecked = {};

		while (nodeIdsToCheck.length > 0) {
			let nodeId = nodeIdsToCheck.pop();

			if (nodeIdsChecked[nodeId]) continue;

			if (nodeId === targetNodeId) return true;

			nodeIdsChecked[nodeId] = true;
			if (this.nodeMap[nodeId]) {
				nodeIdsToCheck = nodeIdsToCheck.concat(Object.keys(this.nodeMap[nodeId]));
			}
		}

		return false;
	}

	isPortsConnected(fromNodeId, fromOutputAttr, toNodeId, toInputAttr) {
		let output = this.getAddress(fromNodeId, fromOutputAttr);
		let input = this.getAddress(toNodeId, toInputAttr);

		return this.portMap[output] && this.portMap[output][input];
	}

	connect(fromNodeId, fromOutputAttr, toNodeId, toInputAttr) {
		// prevent infinite feedback loop:
		if (this.isConnected(toNodeId, fromNodeId)) throw new Error("Would cause cycle!");
		if (this.isPortsConnected(fromNodeId, fromOutputAttr, toNodeId, toInputAttr)) return;
		// this.getNodeById(fromNodeId).onConnect('output', fromOutputIndex)
		// this.getNodeById(toNodeId).onConnect('input', toInputIndex)

		let output = this.getAddress(fromNodeId, fromOutputAttr);
		let input = this.getAddress(toNodeId, toInputAttr);

		if (!this.nodeMap[fromNodeId]) this.nodeMap[fromNodeId] = {};
		if (!this.nodeMap[fromNodeId][toNodeId]) this.nodeMap[fromNodeId][toNodeId] = 0;
		if (!this.portMap[output]) this.portMap[output] = {};
		if (!this.inputsMap[input]) this.inputsMap[input] = {};

		this.nodeMap[fromNodeId][toNodeId]++;
		this.portMap[output][input] = true;
		this.inputsMap[input][output] = true;

		//@TODO: Can't enable these until connections are "reconnected"
		//when restoring from state
		// this.byId[fromNodeId].componentInstance.outputConnectedCallback(fromOutputAttr);
		// this.byId[toNodeId].componentInstance.inputConnectedCallback(toInputAttr);
	}

	disconnect(fromAddr, toAddr) {
		let from = this.getParsedAddress(fromAddr);
		let to = this.getParsedAddress(toAddr);

		let fromNodeId = from[0];
		let fromOutput = from[1];
		let toNodeId = to[0];
		let toInput = to[1];

		let fromNode = this.byId[fromNodeId];
		let toNode = this.byId[toNodeId];

		if (!fromNode || !toNode) {
			console.error("Missing node for disconnect action:", fromAddr, toAddr);
			return false;
		}

		let numFromNodeConnections = this.getNodesOutputConnections(fromNodeId).length;
		let numToNodeConnections = this.getNodesInputConnections(toNodeId).length;
		let numFromConnections = this.getInputsConnectedToOutput(fromNodeId, fromOutput).length;
		let numToConnections = this.getOutputsConnectedToInput(toNodeId, toInput).length;

		fromNode.componentInstance.outputDisconnectedCallback(
			fromOutput,
			numFromConnections - 1,
			numFromNodeConnections - 1
		);
		toNode.componentInstance.inputDisconnectedCallback(
			toInput,
			numToConnections - 1,
			numToNodeConnections - 1
		);

		let output = this.getAddress(fromNodeId, fromOutput);
		let input = this.getAddress(toNodeId, toInput);

		if (!this.portMap[output] || !this.portMap[output][input]) return false;

		this.nodeMap[fromNodeId][toNodeId]--;
		delete this.portMap[output][input];
		delete this.inputsMap[input][output];

		if (this.nodeMap[fromNodeId][toNodeId] <= 0) delete this.nodeMap[fromNodeId][toNodeId];
		if (Object.keys(this.nodeMap[fromNodeId]).length === 0) delete this.nodeMap[fromNodeId];
		if (Object.keys(this.portMap[output]).length === 0) delete this.portMap[output];
		if (Object.keys(this.inputsMap[input]).length === 0) delete this.inputsMap[input];

		//@TODO - Should this be a "live" connection?
		//if unplugged should null be sent?

		return true;
	}

	// This sets the internal value in values[] but does not set the web component attribute
	setInputValue(nodeId, attrName, value, applyUserTransformIfAvailable = true) {
		if (!this.byId[nodeId]) return;

		let inputs = this.byId[nodeId].inputs;
		if (!inputs[attrName]) return;

		let node = this.byId[nodeId];
		let input = inputs[attrName];

		// console.log("SET", nodeId, attrName, value, input);

		// Apply type transformation:
		if (input.restrict) {
			if (input.restrict.transformValue) {
				value = input.restrict.transformValue(value);
			} else {
				value = input.restrict(value);
			}
		}

		// console.log("SET", nodeId, attrName, value, input, typeof value);

		// Apply user transformation:
		if (applyUserTransformIfAvailable) {
			let transforms = node.transformFns;

			if (transforms[attrName]) {
				// debugger;
				try {
					value = transforms[attrName](value);
				} catch (e) {
					Events.emit("app:error", e.message);
				}
			}
		}

		if (!this.values[nodeId]) this.values[nodeId] = {};
		this.values[nodeId][attrName] = value;

		return value;
	}

	setAttribute(nodeId, attrName, value, applyUserTransformIfAvailable = true) {
		if (!this.byId[nodeId]) return;

		// console.log("sa", nodeId, attrName, value, applyUserTransformIfAvailable);
		// if (
		// 	!this.values[nodeId] ||
		// 	typeof this.values[nodeId][attrName] === "undefined" ||
		// 	this.values[nodeId][attrName] === value
		// ) {
		// 	return;
		// }

		value = this.setInputValue(nodeId, attrName, value, applyUserTransformIfAvailable);

		let node = this.byId[nodeId];
		let targetComponentInstance = node.componentInstance;

		targetComponentInstance.native_setAttribute(attrName, value);
	}

	setAttributeFromComponent(nodeId, attrName, value) {
		// console.log("safc", nodeId, attrName, value);
		if (!this.byId[nodeId]) return;

		this.setAttribute(nodeId, attrName, value, true);
		Events.emit("app:update");
	}

	isAttributeSet(nodeId, attrName) {
		return Boolean(this.values[nodeId] && typeof this.values[nodeId][attrName] !== "undefined");
	}

	getAttribute(nodeId, attrName) {
		if (!this.isAttributeSet(nodeId, attrName)) return null;
		return this.values[nodeId][attrName];
	}

	getNodesConnections(nodeId) {
		return this.getNodesOutputConnections(nodeId).concat(this.getNodesInputConnections(nodeId));
	}

	getInputsConnectedToOutput(nodeId, outputName) {
		let outs = this.portMap[this.getAddress(nodeId, outputName)];

		return outs ? Object.keys(outs) : [];
	}

	getOutputsConnectedToInput(nodeId, inputName) {
		let ins = this.inputsMap[this.getAddress(nodeId, inputName)];

		return ins ? Object.keys(ins) : [];
	}

	getNodesOutputConnections(nodeId) {
		let outs = [];

		for (let outputAddr in this.portMap) {
			if (this.getParsedAddress(outputAddr)[0] !== nodeId) continue;

			for (let inputAddr in this.portMap[outputAddr]) {
				outs.push([outputAddr, inputAddr]);
			}
		}

		return outs;
	}

	getNodesInputConnections(nodeId) {
		let ins = [];

		for (let inputAddr in this.inputsMap) {
			if (this.getParsedAddress(inputAddr)[0] !== nodeId) continue;

			for (let outputAddr in this.inputsMap[inputAddr]) {
				ins.push([outputAddr, inputAddr]);
			}
		}

		return ins;
	}
}
