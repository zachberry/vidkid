class ChainPool {
	constructor() {
		this.nodeIdToChainId = {}; //'n22' = 'c3'
		this.pool = {};
		this.nextChainId = 0;
	}

	getNextId() {
		let id = "c" + this.nextChainId;
		this.nextChainId++;

		return id;
	}

	getNewChain() {
		return new Chain(this.getNextId());
	}

	get(nodeId, chainId) {
		if (!chainId) chainId = this.nodeIdToChainId[nodeId];
		if (chainId && this.pool[chainId]) return this.pool[chainId];

		let newChain = this.getNewChain();
		this.pool[newChain.id] = newChain;
		this.nodeIdToChainId[nodeId] = newChain.id;

		return newChain;
	}

	release(nodeId) {
		let chainId = this.nodeIdToChainId[nodeId];
		if (!chainId) return;

		delete this.pool[chainId];
		delete this.nodeIdToChainId[nodeId];
	}
}

export default ChainPool;
