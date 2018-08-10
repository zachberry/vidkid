const N = require("../web-components/base-node").default;
class Node extends N {
	static get inputs() {
		return [
			{
				name: "in",
				observe: true
			}
		];
	}

	static get outputs() {
		return ["out"];
	}

	onAttrChanged(name, oldValue, newValue) {
		switch (name) {
			case "in":
				this.send("out", newValue);
				break;
		}
	}

	onReady() {}
	onDestroy() {}
	onScreenDestroy() {}
	onScreenUpdated() {}
	onInputConnected(name, toAddress) {}
	onOutputConnected(name, fromAddress) {}
	onInputWillDisconnect(name, fromAddress) {}
	onOutputWillDisconnect(name, toAddress) {}
	onInputDisconnected(name, numConnections, numNodeConnections) {}
	onOutputDisconnected(name, numConnections, numNodeConnections) {}
}

export default {
	label: "New Node",
	text: Node.toString()
};
