const N = require("../web-components/base-node").default;
class ExampleNode extends N {
	// This simply color-codes the node:
	static get type() {
		return N.GENERIC;
	} // Valid: N.GENERIC, N.HARDWARE, N.SCREEN

	static get inputs() {
		return [
			{
				name: "in",
				observe: true, // Set to true to hear the change in 'onAttrChanged'
				defaultValue: 0,
				restrict: Number, // Forces value to a type.
				// Valid: Number, String, Boolean, N.float(min, max), N.int(min, max), N.set(array)
				control: N.range({ min: 0, max: 100 }) // The UI on the node to control the value.
				// Valid: N.text(), N.number(), N.color(), N.toggle(), N.range(), N.select(), N.file(), N.button()
				// If you don't specify a control a default control will display based on `restrict`

				// Other options:
				//visible: true,
				//editable: true
				//showValue: true
			}
		];
	}

	static get outputs() {
		return ["out"];
	}

	onAttrChanged(name, oldValue, newValue) {
		// An observed input has been updated.
		// oldValue and newValue are always strings as these are
		// attributes on the component. Use this.getAttribute
		// to get the typed value.

		// If you are recieving an elementId you can get the DOM
		// element with this.getEl(elId);

		// If you are recieving a chainId you can get the chain with
		// this.getChain(chainId);

		switch (name) {
			case "in":
				this.send("out", newValue);
				break;
		}
	}

	onReady() {
		// Called when component is on the DOM.
		// You have access to this.screen (The display)
		// and this.root (Your web component HTML)
		// If you have any elements that you might pass along on
		// an output then register them:
		// this.registerEl(giveAName, domElement);
	}

	onDestroy() {
		// Called when component will be removed from the DOM.
		// Remove any event listeners and elements on the screen.
		// Release any chains you may be holding on to:
		// this.releaseChain(chainId);
	}

	onScreenDestroy() {
		// Called when the display is being updated. Any attached DOM elements
		// will be destroyed so you should remove them.
	}

	onScreenUpdated() {
		// Called when the display has been updated. If you attached any DOM
		// elements to screen you can re-attach them.
	}

	onInputConnected(name, toAddress) {
		// Called when another node has connected to an input.
		// If your node has an intensive process perhaps delay it
		// until this method is called.
	}

	onOutputConnected(name, fromAddress) {
		// Called when another node has connected to an output.
		// If your node has an intensive process perhaps delay it
		// until this method is called.
		// You may want to send a value forceably here:
		// this.sendTo(name, fromAddress, value)
	}

	onInputWillDisconnect(name, fromAddress) {
		// Called when another node is disconnecting from an input.
	}

	onOutputWillDisconnect(name, toAddress) {
		// Called when another node is disconnecting from an output.
		// You have a chance to send a null value to the other node here:
		// this.sendTo(name, toAddress, value)
	}

	onInputDisconnected(name, numConnections, numNodeConnections) {
		// A node has disconnected from an input. numConnections is
		// the number of remaining connections to this input.
		// numNodeConnections are the number of nodes connected to your node.
		// If either of these are 0 you may be able to halt an expensive process.
	}

	onOutputDisconnected(name, numConnections, numNodeConnections) {
		// A node has disconnected from an output. numConnections is
		// the number of remaining connections to this input.
		// numNodeConnections are the number of nodes connected to your node.
		// If either of these are 0 you may be able to halt an expensive process.
	}
}

const template = `<div id="container">
	<div id="example">This is your webcomponent HTML</div>
</div>`;

const css = `#container {
	width: 13em;
}

#example {
	background: red;
}`;

export default {
	label: "Example Node",
	text: ExampleNode.toString(),
	templateHTML: template,
	templateCSS: css
};
