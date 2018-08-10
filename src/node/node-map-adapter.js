export default class NodeMapAdapter {
	constructor(nodeMap) {
		this.nodeMap = nodeMap;
	}

	setAttribute(nodeId, attrName, value) {
		this.nodeMap.setAttributeFromComponent(nodeId, attrName, value);
	}

	getAttribute(nodeId, attrName) {
		return this.nodeMap.getAttribute(nodeId, attrName);
	}

	send(nodeId, outputName, value) {
		let connections = this.nodeMap.getInputsConnectedToOutput(nodeId, outputName);

		for (let connection of connections) {
			let tokens = this.nodeMap.getParsedAddress(connection);
			let connectedNodeId = tokens[0];
			let inputName = tokens[1];

			this.nodeMap.setAttributeFromComponent(connectedNodeId, inputName, value);
		}
	}

	sendTo(nodeId, outputName, inputAddr, value) {
		let tokens = this.nodeMap.getParsedAddress(inputAddr);
		let connectedNodeId = tokens[0];
		let inputName = tokens[1];

		this.nodeMap.setAttributeFromComponent(connectedNodeId, inputName, value);
	}

	getChain(nodeId, chainId) {
		return this.nodeMap.chainPool.get(nodeId, chainId);
	}

	releaseChain(nodeId, chainId) {
		this.nodeMap.chainPool.release(nodeId, chainId);
	}

	registerEl(nodeId, name, el) {
		return this.nodeMap.elementRegistry.registerEl(nodeId, name, el);
	}

	getEl(elId) {
		return this.nodeMap.elementRegistry.getEl(elId);
	}

	releaseEl(nodeId, name) {
		return this.nodeMap.elementRegistry.releaseEl(nodeId, name);
	}

	releaseAllEls(nodeId, name) {
		return this.nodeMap.elementRegistry.releaseAllEls(nodeId, name);
	}
}
