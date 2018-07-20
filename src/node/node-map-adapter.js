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
			// let connectedNode = this.nodeMap.getNodeById(tokens[0])
			let connectedNodeId = tokens[0];
			let inputName = tokens[1];

			// this.nodeMap.setAttribute(connectedNodeId, inputName, value);
			this.nodeMap.setAttributeFromComponent(connectedNodeId, inputName, value);
		}
	}
}
