import Events from "../events";

// Included libraries:
const THREE = require("three");
const TWEEN = require("@tweenjs/tween.js");

const N = require("../web-components/base-node").default; // eslint-disable-line no-unused-vars
// var { int, float } = require("./input-restrict-functions").default;

// const methodsToWrap = ["attributeChangedCallback"];
// const wrapMethods = C => {
// 	//@TODO - How much slower is this?

// 	for (let methodName of methodsToWrap) {
// 		let origMethod = C.prototype[methodName];

// 		if (origMethod) {
// 			C.prototype[methodName] = (arg1, arg2, arg3) => {
// 				try {
// 					origMethod(arg1, arg2, arg3);
// 				} catch (e) {
// 					Events.emit("app:error", "yo yo shit");
// 				}
// 			};
// 		}
// 	}
// 	// let origAttrChangedCallback = C.prototype.attributeChangedCallback;
// 	// if (origAttrChangedCallback) {
// 	// 	C.prototype.attributeChangedCallback = (name, oldValue, newValue) => {
// 	// 		try {
// 	// 			origAttrChangedCallback(name, oldValue, newValue);
// 	// 		} catch (e) {
// 	// 			Events.emit("app:error", C.name + " attributeChangedCallback error: " + e.message);
// 	// 		}
// 	// 	};
// 	// }
// };

export default (elementName, classText, templateHTML = null, templateCSS = null) => {
	//Eval classText to and store result into EvaledClass
	try {
		// 	var EvaledClass = eval(/*eslint-disable-line no-eval*/ `
		// 	(
		// 		(function() {
		// 			return (
		// 				${classText}
		// 			)
		// 		})
		// 	)()
		// `);
		// let f = new Function("THREE", "TWEEN", "N", `return (${classText})`);
		var EvaledClass = new Function("THREE", "TWEEN", "N", `return (${classText})`)(THREE, TWEEN, N);
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
	// let origAttrChangedCallback = EvaledClass.prototype.attributeChangedCallback;
	// if (origAttrChangedCallback) {
	// 	EvaledClass.prototype.attributeChangedCallback = (name, oldValue, newValue) => {
	// 		try {
	// 			console.log("runrunrun time");
	// 			debugger;
	// 			origAttrChangedCallback(name, oldValue, newValue);
	// 		} catch (e) {
	// 			Events.emit(
	// 				"app:error",
	// 				EvaledClass.name + " attributeChangedCallback error: " + e.message
	// 			);
	// 		}
	// 	};
	// }

	// wrapMethods(EvaledClass);

	// Events.emit("test");
	// EvaledClass = new Proxy(EvaledClass, {
	// 	get: function(target, propName, receiver) {
	// 		const origMethod = target[propName];

	// 		console.log("pp", propName, typeof target[propName], origMethod);
	// 		if (typeof target[propName] !== "function") {
	// 			return Reflect.get(target, propName, receiver);
	// 		}

	// 		return function(...args) {
	// 			console.log("PROX");
	// 			return origMethod.apply(target, args);
	// 		};
	// 	}
	// });
	// let P = new Proxy(EvaledClass, {
	// 	construct() {
	// 		return new EvaledClass();
	// 	}
	// });

	// var P = new Proxy(EvaledClass, {
	// 	construct() {
	// 		return new Proxy(new EvaledClass(), {
	// 			get(target, value) {
	// 				if (value == "element") return target;
	// 				console.info(`proxy: property ${value} for <${target.localName}> is "${target[value]}"`);
	// 				return target[value];
	// 			}
	// 		});
	// 	}
	// });
	// EvaledClass = P;
	// EvaledClass = new Proxy(EvaledClass, {
	// 	get(target, value) {
	// 		console.info(`proxy: property ${value} for <${target.localName}> is "${target[value]}"`);
	// 		return target[value];
	// 	}
	// });

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
