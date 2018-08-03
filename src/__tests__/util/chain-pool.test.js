jest.mock("../../util/chain", () => {
	return class MockChain {
		static fromSerializable(o) {
			return new MockChain(o.serializedId);
		}

		constructor(id) {
			this.id = id;
		}

		toSerializable() {
			return { serializedId: this.id };
		}
	};
});

import ChainPool from "../../util/chain-pool";
import Chain from "../../util/chain";

describe("chain-pool", () => {
	let p;

	beforeEach(() => {
		p = new ChainPool();
	});

	test("Constructor initalizes", () => {
		expect(p).toEqual({
			nodeIdToChainId: {},
			pool: {},
			nextChainId: 0
		});
	});

	test("getNextId returns next id", () => {
		expect(p.getNextId()).toBe("c0");
		expect(p.getNextId()).toBe("c1");
		expect(p.getNextId()).toBe("c2");
	});

	test("getNewChain returns new chain with next id", () => {
		expect(p.getNewChain()).toEqual(new Chain("c0"));
		expect(p.getNewChain()).toEqual(new Chain("c1"));
		expect(p.getNewChain()).toEqual(new Chain("c2"));
	});

	test("get(nodeId, null) creates a new chain if it doesnt exist and returns it for nodeId", () => {
		let cA = p.get("node-id-A", null);

		expect(p).toEqual({
			nextChainId: 1,
			nodeIdToChainId: { "node-id-A": "c0" },
			pool: { c0: new Chain("c0") }
		});

		let cB = p.get("node-id-A", null);

		expect(p).toEqual({
			nextChainId: 1,
			nodeIdToChainId: { "node-id-A": "c0" },
			pool: { c0: new Chain("c0") }
		});
		expect(cA).toBe(cB);
	});

	test("get(nodeId, chainId) returns chain with id of chainId", () => {
		let cA = p.get("node-id-A", null);
		let cB = p.get("node-id-B", cA.id);

		expect(p).toEqual({
			nextChainId: 1,
			nodeIdToChainId: { "node-id-A": "c0" },
			pool: { c0: new Chain("c0") }
		});
		expect(cA).toBe(cB);
	});

	test("get(nodeId, chainId) releases the chain that nodeId owned (if it owned it)", () => {
		let cA = p.get("node-id-A", null);
		let cB = p.get("node-id-B", null);

		expect(p).toEqual({
			nextChainId: 2,
			nodeIdToChainId: { "node-id-A": "c0", "node-id-B": "c1" },
			pool: { c0: new Chain("c0"), c1: new Chain("c1") }
		});
		expect(cA).not.toBe(cB);

		let cC = p.get("node-id-B", cA.id);
		expect(p).toEqual({
			nextChainId: 2,
			nodeIdToChainId: { "node-id-A": "c0" },
			pool: { c0: new Chain("c0") }
		});
		expect(cA).toBe(cC);
	});

	test("release(nodeId, null) deletes the chain owned by nodeId", () => {
		let cA = p.get("node-id-A", null);
		p.release("node-id-A", null);

		expect(p).toEqual({
			nextChainId: 1,
			nodeIdToChainId: {},
			pool: {}
		});
	});

	test("release(nodeId, chainId) splits the chain with id chainId at the nodeId point", () => {
		let cA = p.get("node-id-A", null);
		p.get("node-id-B", cA.id);
		cA.remove = jest.fn();

		p.release("node-id-B", cA.id);
		expect(cA.remove).toHaveBeenCalledWith("node-id-B");
	});

	test("toSerializable returns a serializable representation", () => {
		let cA = p.get("node-id-A", null);
		let cB = p.get("node-id-B", null);

		expect(p.toSerializable()).toEqual({
			nodeIdToChainId: { "node-id-A": "c0", "node-id-B": "c1" },
			nextChainId: 2,
			pool: {
				c0: { serializedId: "c0" },
				c1: { serializedId: "c1" }
			}
		});
	});

	test("fromSerializable restores data from serializable representation", () => {
		let cA = p.get("node-id-A", null);
		let cB = p.get("node-id-B", null);
		let o = p.toSerializable();

		let p2 = new ChainPool();
		p2.fromSerializable(o);

		expect(p).not.toBe(p2);
		expect(p).toEqual(p2);
		expect(p2.toSerializable()).toEqual(o);
	});
});
