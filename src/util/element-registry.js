class ElementRegistry {
	constructor() {
		this.init();
	}

	init() {
		this.els = {};
		this.elIdsByNodeId = {};
	}

	registerEl(nodeId, name, el) {
		let elId = nodeId + "." + name;
		this.els[elId] = el;
		if (!this.elIdsByNodeId[nodeId]) {
			this.elIdsByNodeId[nodeId] = {};
		}
		this.elIdsByNodeId[nodeId][elId] = true;

		return elId;
	}

	releaseEl(nodeId, name) {
		delete this.els[nodeId + "." + name];
	}

	releaseAllEls(nodeId) {
		for (let elId in this.elIdsByNodeId[nodeId]) {
			delete this.els[elId];
		}

		delete this.elIdsByNodeId[nodeId];
	}

	getEl(elId) {
		return this.els[elId] || null;
	}
}

export default ElementRegistry;
