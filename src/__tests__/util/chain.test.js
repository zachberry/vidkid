import Chain from "../../util/chain";

describe("chain", () => {
	let c;
	let addTestValues = c => {
		c.set("node-id-A", "A");
		c.set("node-id-B", "B");
		c.set("node-id-C", "C");
	};

	beforeEach(() => {
		c = new Chain("chain-id");
	});

	test("Constructor initalizes", () => {
		expect(c).toEqual({
			id: "chain-id",
			valuesList: [],
			valuesById: {},
			nodeIdList: [],
			indexById: {},
			cachedLists: {}
		});
	});

	test("set() updates the nodeIdList, indexById, valuesById and valuesList data structures", () => {
		c.set("node-id-A", "A");
		expect(c).toEqual({
			id: "chain-id",
			valuesList: ["A"],
			valuesById: { "node-id-A": "A" },
			nodeIdList: ["node-id-A"],
			indexById: { "node-id-A": 0 },
			cachedLists: {}
		});

		c.set("node-id-B", "B");
		expect(c).toEqual({
			id: "chain-id",
			valuesList: ["A", "B"],
			valuesById: { "node-id-A": "A", "node-id-B": "B" },
			nodeIdList: ["node-id-A", "node-id-B"],
			indexById: { "node-id-A": 0, "node-id-B": 1 },
			cachedLists: {}
		});

		c.set("node-id-A", "*");
		expect(c).toEqual({
			id: "chain-id",
			valuesList: ["*", "B"],
			valuesById: { "node-id-A": "*", "node-id-B": "B" },
			nodeIdList: ["node-id-A", "node-id-B"],
			indexById: { "node-id-A": 0, "node-id-B": 1 },
			cachedLists: {}
		});
	});

	test("[test] addTestValues adds three items as expected", () => {
		expect(c).toEqual({
			id: "chain-id",
			valuesList: [],
			valuesById: {},
			nodeIdList: [],
			indexById: {},
			cachedLists: {}
		});

		addTestValues(c);
		expect(c).toEqual({
			id: "chain-id",
			valuesList: ["A", "B", "C"],
			valuesById: { "node-id-A": "A", "node-id-B": "B", "node-id-C": "C" },
			nodeIdList: ["node-id-A", "node-id-B", "node-id-C"],
			indexById: { "node-id-A": 0, "node-id-B": 1, "node-id-C": 2 },
			cachedLists: {}
		});
	});

	test("remove(last node) removes a value from the end of a chain", () => {
		addTestValues(c);
		c.remove("node-id-C");
		expect(c).toEqual({
			id: "chain-id",
			valuesList: ["A", "B"],
			valuesById: { "node-id-A": "A", "node-id-B": "B" },
			nodeIdList: ["node-id-A", "node-id-B"],
			indexById: { "node-id-A": 0, "node-id-B": 1 },
			cachedLists: {}
		});
	});

	test("remove(first node) clears out the chain", () => {
		addTestValues(c);
		c.remove("node-id-A");
		expect(c).toEqual({
			id: "chain-id",
			valuesList: [],
			valuesById: {},
			nodeIdList: [],
			indexById: {},
			cachedLists: {}
		});
	});

	test("remove(middle node) leaves only the items before the middle value", () => {
		addTestValues(c);
		c.remove("node-id-B");
		expect(c).toEqual({
			id: "chain-id",
			valuesList: ["A"],
			valuesById: { "node-id-A": "A" },
			nodeIdList: ["node-id-A"],
			indexById: { "node-id-A": 0 },
			cachedLists: {}
		});
	});

	test("remove() performs noop when bad id given", () => {
		addTestValues(c);
		c.remove("id-which-does-not-exist");
		expect(c).toEqual({
			id: "chain-id",
			valuesList: ["A", "B", "C"],
			valuesById: { "node-id-A": "A", "node-id-B": "B", "node-id-C": "C" },
			nodeIdList: ["node-id-A", "node-id-B", "node-id-C"],
			indexById: { "node-id-A": 0, "node-id-B": 1, "node-id-C": 2 },
			cachedLists: {}
		});
	});

	test("set() and remove() reset cachedLists", () => {
		c.cachedLists = "****";
		c.set("node-id-A", "A");
		expect(c.cachedLists).toEqual({});

		c.cachedLists = "****";
		c.remove("node-id-A");
		expect(c.cachedLists).toEqual({});
	});

	test("get() returns the valuesList", () => {
		let myValuesList = Object.create(null);
		c.valuesList = myValuesList;
		expect(c.get()).toBe(myValuesList);
	});

	test("get(first node) returns all values", () => {
		addTestValues(c);
		expect(c.get("node-id-A")).toEqual(["A", "B", "C"]);
	});

	test("get(last node) returns last value", () => {
		addTestValues(c);
		expect(c.get("node-id-C")).toEqual(["C"]);
	});

	test("get(middle node) returns values for middle node to the last node", () => {
		addTestValues(c);
		expect(c.get("node-id-B")).toEqual(["B", "C"]);
	});

	test("get caches and returns cached values when possible", () => {
		addTestValues(c);
		expect(c.get("node-id-C")).toEqual(["C"]);
		expect(c.cachedLists).toEqual({ "node-id-C": ["C"] });

		expect(c.get("node-id-A")).toEqual(["A", "B", "C"]);
		expect(c.cachedLists).toEqual({ "node-id-A": ["A", "B", "C"], "node-id-C": ["C"] });

		expect(c.get("node-id-B")).toEqual(["B", "C"]);
		expect(c.cachedLists).toEqual({
			"node-id-A": ["A", "B", "C"],
			"node-id-B": ["B", "C"],
			"node-id-C": ["C"]
		});

		c.cachedLists = {
			"node-id-A": "cached-A",
			"node-id-B": "cached-B",
			"node-id-C": "cached-C"
		};

		expect(c.get("node-id-C")).toBe("cached-C");
		expect(c.get("node-id-B")).toBe("cached-B");
		expect(c.get("node-id-A")).toBe("cached-A");
	});

	test("get() performs noop when bad id given", () => {
		addTestValues(c);
		c.cachedLists = "****";

		let v = c.get("id-which-does-not-exist");

		expect(v).toBe(null);
		expect(c.cachedLists).toEqual("****");
	});

	test("getOwn returns a node's own value (and null if value cannot be found)", () => {
		addTestValues(c);
		expect(c.getOwn("node-id-A")).toBe("A");
		expect(c.getOwn("node-id-B")).toBe("B");
		expect(c.getOwn("node-id-C")).toBe("C");
		expect(c.getOwn("node-id-D")).toBe(null);
	});

	test("toSerializable returns a serialized representation", () => {
		addTestValues(c);
		expect(c.toSerializable()).toEqual({
			id: "chain-id",
			values: [
				{
					id: "node-id-A",
					v: "A"
				},
				{
					id: "node-id-B",
					v: "B"
				},
				{
					id: "node-id-C",
					v: "C"
				}
			]
		});
	});

	test("fromSerializable restores data from serialized representation", () => {
		addTestValues(c);
		let o = c.toSerializable();

		let c2 = Chain.fromSerializable(o);

		expect(c).not.toBe(c2);
		expect(c).toEqual(c2);
		expect(c2.toSerializable()).toEqual(o);
	});
});
