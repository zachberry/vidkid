import { float, int } from "../node/input-restrict-functions";
import { range, color, toggle, text, number } from "../node/control-functions";

export default class N extends HTMLElement {
	static float = float;
	static int = int;
	static range = range;
	static color = color;
	static toggle = toggle;
	static text = text;
	static number = number;

	// templateEl contains the HTML written when the component was created.
	// Note that in the constructor the element is not attached to the DOM.
	constructor() {
		super();
	}

	//connectedCallback()
	//disconnectedCallback()
	//adoptedCallback()
	//attributeChangedCallback(name, oldValue, newValue)

	inputConnectedCallback() {}
	outputConnectedCallback() {}
	inputDisconnectedCallback() {}
	outputDisconnectedCallback() {}

	readyCallback() {
		console.log("on ready!");
	}

	destroyCallback() {
		console.log("on destroy!");
	}

	init(id, nodeMapAdapter, templateEl = null) {
		this.id = id;
		this.nodeMapAdapter = nodeMapAdapter;
		this.root = this.attachShadow({ mode: "open" });
		if (templateEl) this.root.appendChild(templateEl.content);
		this.screen = window.document.getElementById("--app--screen").contentDocument;
	}

	send(outputName, outputValue) {
		this.nodeMapAdapter.send(this.id, outputName, outputValue);
	}

	setAttribute(attrName, value) {
		this.nodeMapAdapter.setAttribute(this.id, attrName, value);
	}

	native_setAttribute(attrName, value) {
		HTMLElement.prototype.setAttribute.call(this, attrName, value);
	}
}
