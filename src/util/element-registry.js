class ElementRegistry {
	// static fromSerializable(o) {
	// 	let c = new Chain(null);
	// 	c.fromSerializable(o);

	// 	return c;
	// }

	constructor() {
		this.init();
	}

	init() {
		this.nextId = 0;
		this.els = {};
	}

	// toSerializable() {
	// 	let values = [];
	// 	for (let i = 0, len = this.nodeIdList.length; i < len; i++) {
	// 		let nodeId = this.nodeIdList[i];
	// 		values.push({ id: nodeId, v: this.valuesById[nodeId] });
	// 	}

	// 	return {
	// 		id: this.id,
	// 		values
	// 	};
	// }

	// fromSerializable(o) {
	// 	this.id = o.id;
	// 	o.values.forEach(item => this.set(item.id, item.v));
	// }

	registerEl(nodeId, name, el) {
		let elId = nodeId + "." + name;
		this.els[elId] = el;

		return elId;
	}

	getEl(elId) {
		return this.els[elId] || null;
	}

	example() {
		let elId = this.registerEl(this.id, name, this.root.getElementById("video"));

		//-------

		let el = this.getEl(this.id, elId);

		//-------
	}
	onElRevoked(elId, el) {}
	onAskForEl(name) {}
}

export default ElementRegistry;
