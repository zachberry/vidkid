var N = require("../web-components/base-node").default; // eslint-disable-line no-unused-vars
// var { int, float } = require("./input-restrict-functions").default;

export default (elementName, classText, templateHTML = null, templateCSS = null) => {
	//Eval classText to and store result into EvaledClass
	try {
		var EvaledClass = eval(/*eslint-disable-line no-eval*/ `
		(
			(function() {
				return (
					${classText}
				)
			})
		)()
	`);
	} catch (e) {
		return {
			isError: true,
			error: e
		};
	}

	// We override the setAttribute method to call the nodeMap's setAttribute method instead!
	// let origSetAttr = EvaledClass.prototype.setAttribute;
	// EvaledClass.prototype.setAttribute = signalManager.setAttribute.bind(signalManager, nodeId);
	// EvaledClass.prototype.native_setAttribute = origSetAttr;

	// Grab the inputs and outputs from the class
	let inputs = EvaledClass.inputs || [];

	// Dynamically create and add the webcomponent observedAttributes
	// getter:
	let observedAttributes = [];
	inputs.forEach(input => {
		if (input.observe === true) observedAttributes.push(input.name);
	});
	if (observedAttributes.length > 0) {
		Object.defineProperty(EvaledClass, "observedAttributes", {
			get: () => observedAttributes
		});
	}

	// Register the custom component with the registry
	customElements.define(elementName, EvaledClass);

	let templateEl = null;
	let styleEl = null;

	if (templateHTML) {
		templateEl = document.createElement("template");
		templateEl.innerHTML = templateHTML;
	}
	if (templateHTML && templateCSS) {
		styleEl = document.createElement("style");
		styleEl.innerText = templateCSS;
	}

	// let inst = new EvaledClass(templateEl);
	// inst.init(nodeId, signalManager);

	// return inst;

	return {
		isError: false,
		component: EvaledClass,
		template: templateEl,
		style: styleEl
	};
};
