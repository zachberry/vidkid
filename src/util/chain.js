import clone from "clone";

class Chain {
	static fromSerializable(o) {
		let c = new Chain(null);
		c.fromSerializable(o);

		return c;
	}

	constructor(id) {
		this.id = id;
		this.init();
	}

	init() {
		this.valuesList = [];
		this.valuesById = {};
		this.nodeIdList = [];
		this.indexById = {};
		this.cachedLists = {};
	}

	toSerializable() {
		let values = [];
		for (let i = 0, len = this.nodeIdList.length; i < len; i++) {
			let nodeId = this.nodeIdList[i];
			values.push({ id: nodeId, v: this.valuesById[nodeId] });
		}

		return {
			id: this.id,
			values
		};
	}

	fromSerializable(o) {
		this.id = o.id;
		o.values.forEach(item => this.set(item.id, item.v));
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

	remove(nodeId) {
		if (typeof this.valuesById[nodeId] === "undefined") return;

		this.cachedLists = {};

		let thisIndex = this.indexById[nodeId];
		for (let i = thisIndex, len = this.nodeIdList.length; i < len; i++) {
			let nodeId = this.nodeIdList[i];
			delete this.indexById[nodeId];
			delete this.valuesById[nodeId];
		}

		let newNodeIdList = [];
		let newValuesList = [];
		for (let i = 0, len = thisIndex; i < len; i++) {
			let nodeId = this.nodeIdList[i];
			newNodeIdList.push(this.nodeIdList[i]);
			newValuesList.push(this.valuesById[nodeId]);
		}
		this.nodeIdList = newNodeIdList;
		this.valuesList = newValuesList;
	}

	get(nodeId = null) {
		if (nodeId === null) return this.valuesList;

		if (typeof this.valuesById[nodeId] === "undefined") return null;

		if (this.cachedLists[nodeId]) return this.cachedLists[nodeId];

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
