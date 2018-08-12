// Included libraries:
const THREE = require("three");
const TWEEN = require("@tweenjs/tween.js");

export default (elementName, classText, templateHTML = null, templateCSS = null) => {
	//Eval classText to and store result into EvaledClass
	try {
		console.log("EVAL:");
		console.log(classText);
		var EvaledClass = new Function("THREE", "TWEEN", `return (${classText})`)(THREE, TWEEN);
	} catch (e) {
		return {
			isError: true,
			error: e
		};
	}

	// Grab the inputs and outputs from the class
	let inputs = EvaledClass.inputs || [];

	// Dynamically create and add the webcomponent observedAttributes
	let observedAttributes = [];
	let testEl = document.createElement("div");
	for (let i = 0, len = inputs.length; i < len; i++) {
		let input = inputs[i];

		// Check if this is a valid name:
		try {
			testEl.setAttribute(input.name, 1);
		} catch (e) {
			return {
				isError: true,
				error: e
			};
		}
		if (input.observe === true) observedAttributes.push(input.name);
	}

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

	return {
		isError: false,
		component: EvaledClass,
		template: templateEl,
		style: styleEl
	};
};
