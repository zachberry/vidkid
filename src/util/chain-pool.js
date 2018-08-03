import clone from "clone";

import Chain from "./chain";

class ChainPool {
	constructor() {
		this.init();
	}

	init() {
		this.nodeIdToChainId = {}; //'n22' = 'c3'
		this.pool = {};
		this.nextChainId = 0;
	}

	toSerializable() {
		let serializedPool = {};
		for (let k in this.pool) {
			serializedPool[k] = this.pool[k].toSerializable();
		}

		return {
			nodeIdToChainId: clone(this.nodeIdToChainId),
			nextChainId: this.nextChainId,
			pool: serializedPool
		};
	}

	fromSerializable(o) {
		this.init();
		this.nodeIdToChainId = clone(o.nodeIdToChainId);
		this.nextChainId = o.nextChainId;
		for (let k in o.pool) {
			this.pool[k] = Chain.fromSerializable(o.pool[k]);
		}
	}

	getNextId() {
		let id = "c" + this.nextChainId;
		this.nextChainId++;

		return id;
	}

	getNewChain() {
		return new Chain(this.getNextId());
	}

	get(nodeId, chainId = null) {
		let chainIdToFetch;
		let chainIdFromNodeId = this.nodeIdToChainId[nodeId];

		// If a chain owner is asking for another chain:
		if (chainIdFromNodeId && chainId) {
			this.release(nodeId, null);
			chainIdToFetch = chainId;
		}
		// If a chain owner is asking for its chain:
		else if (chainIdFromNodeId && !chainId) {
			chainIdToFetch = chainIdFromNodeId;
		}
		// If a node is asking to babysit another chain
		else if (!chainIdFromNodeId && chainId) {
			chainIdToFetch = chainId;
		}
		// A node is asking to own a new chain
		else {
			chainIdToFetch = null;
		}

		let chain = this.pool[chainIdToFetch];
		if (!chain) {
			chain = this.getNewChain();
			this.pool[chain.id] = chain;
			this.nodeIdToChainId[nodeId] = chain.id;
		}

		return chain;
	}

	release(nodeId, chainId = null) {
		if (!chainId) {
			// This must be the chain owner.
			chainId = this.nodeIdToChainId[nodeId];
			if (chainId) {
				delete this.pool[chainId];
				delete this.nodeIdToChainId[nodeId];
			}
		} else {
			// This must be a link in the chain, split it
			let chain = this.pool[chainId];
			if (chain) chain.remove(nodeId);
		}
	}
}

export default ChainPool;
