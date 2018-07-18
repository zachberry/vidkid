var N = require("../web-components/base-node").default;
// var { int, float } = require("./input-restrict-functions").default;

export default (elementName, classText) => {
	//Eval classText to and store result into EvaledClass
	var EvaledClass = eval(`
		(
			(function() {
				return (
					${classText}
				)
			})
		)()
	`);

	// We override the setAttribute method to call the nodeMap's setAttribute method instead!
	// let origSetAttr = EvaledClass.prototype.setAttribute;
	// EvaledClass.prototype.setAttribute = signalManager.setAttribute.bind(signalManager, nodeId);
	// EvaledClass.prototype.native_setAttribute = origSetAttr;

	// Grab the inputs and outputs from the class
	let inputs = EvaledClass.inputs || [];
	let outputs = EvaledClass.outputs || [];

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

	// 	let templateEl = document.createElement("template");
	// 	templateEl.innerHTML = `<div>
	// 	<select id="select"></select><button>Press me</button>
	// </div>`;

	// let inst = new EvaledClass(templateEl);
	// inst.init(nodeId, signalManager);

	// return inst;

	return EvaledClass;
};
