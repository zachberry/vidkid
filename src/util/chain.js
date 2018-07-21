class Chain {
	constructor(id) {
		this.id = id;
		this.valuesList = [];
		this.valuesById = {};
		this.nodeIdList = [];
		this.indexById = {};
		this.cachedLists = {};
	}

	set(nodeId, value) {
		this.cachedLists = {};

		if (!this.valuesById[nodeId]) {
			this.nodeIdList.push(nodeId);
			this.indexById[nodeId] = this.nodeIdList.length - 1;
		}

		this.valuesById[nodeId] = value;
		this.valuesList[this.indexById[nodeId]] = value;
	}

	// remove(nodeId) {
	// 	for(let i = this.indexById[nodeId] + 1, len = this.nodeIdList.length; i < len) {
	// 		this.indexById[this.nodeIdList[i]] -= 1
	// 	}
	// 	delete this.valuesById[nodeId];
	// 	this.nodeIdList.splice(this.nodeIdList.indexOf(nodeId), 1);
	// }

	remove(nodeId) {
		this.cachedLists = {};

		let thisIndex = this.indexById[nodeId];
		for (let i = thisIndex, len = this.nodeIdList.length; i < len; i++) {
			let nodeId = this.nodeIdList[i];
			delete this.indexById[nodeId];
			delete this.valuesById[nodeId];
			delete this.valuesList[i];
		}

		let newNodeIdList = [];
		for (let i = 0, len = thisIndex; i < len; i++) {
			newNodeIdList.push(this.nodeIdList[i]);
		}
		this.nodeIdList = newNodeIdList;
	}

	get(nodeId = null) {
		if (nodeId === null) return this.valuesList;
		if (nodeId !== null && this.cachedLists[nodeId]) return this.cachedLists[nodeId];

		let result = [];
		let start = nodeId === null ? 0 : this.indexById[nodeId];
		for (let i = start, len = this.nodeIdList.length; i < len; i++) {
			result.push(this.valuesList[i]);
		}

		this.cachedLists[nodeId] = result;

		return result;
	}

	getOwn(nodeId) {
		return this.valuesById[nodeId] ? this.valuesById[nodeId] : null;
	}
}

export default Chain;
