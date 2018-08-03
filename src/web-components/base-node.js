import Events from "../events";

import { float, int, set } from "../node/input-restrict-functions";
import {
	range,
	color,
	toggle,
	text,
	number,
	select,
	file,
	button
} from "../node/control-functions";

export default class N extends HTMLElement {
	static GENERIC = "generic";
	static HARDWARE = "hardware";
	static SCREEN = "screen";

	static float = float;
	static int = int;
	static set = set;

	static range = range;
	static color = color;
	static toggle = toggle;
	static text = text;
	static number = number;
	static select = select;
	static file = file;
	static button = button;

	//connectedCallback()
	//disconnectedCallback()
	//adoptedCallback()
	//attributeChangedCallback(name, oldValue, newValue)

	// inputConnectedCallback() {}
	// outputConnectedCallback() {}

	init(id, nodeMapAdapter, templateEl = null, styleEl = null) {
		this.id = id;
		this.nodeMapAdapter = nodeMapAdapter;
		this.root = this.attachShadow({ mode: "open" });

		if (templateEl) this.root.appendChild(templateEl.content);
		if (templateEl && styleEl) this.root.appendChild(styleEl);

		this.screen = window.document.getElementById("--app--screen").contentDocument;
	}

	send(outputName, outputValue) {
		this.nodeMapAdapter.send(this.id, outputName, outputValue);
	}

	getChain(chainId) {
		return this.nodeMapAdapter.getChain(this.id, chainId);
	}

	releaseChain(chainId) {
		return this.nodeMapAdapter.releaseChain(this.id, chainId);
	}

	getAttribute(attrName) {
		return this.nodeMapAdapter.getAttribute(this.id, attrName);
	}

	native_getAttribute(attrName) {
		return HTMLElement.prototype.getAttribute.call(this, attrName);
	}

	setAttribute(attrName, value) {
		this.nodeMapAdapter.setAttribute(this.id, attrName, value);
	}

	native_setAttribute(attrName, value) {
		HTMLElement.prototype.setAttribute.call(this, attrName, value);
	}

	attributeChangedCallback(attrName, oldValue, newValue) {
		try {
			this.onAttrChanged(attrName, oldValue, newValue);
		} catch (e) {
			Events.emit("app:error", this.id + " attrChangedCallback error: " + e.message);
		}
	}

	onAttrChanged() {}
	onInputDisconnected() {}
	onOutputDisconnected() {}
	onScreenDestroy() {}
	onScreenUpdated() {}
	onReady() {}
	onDestroy() {}
}
