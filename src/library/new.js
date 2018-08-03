const t = `class Node extends N {
	static get inputs() {
	  return [
			{
				name: 'my-input',
				observe: true,
				defaultValue: null,
				restrict: null,
				control: null
			}
		]
	}

	static get outputs() {
	  return ['my-output']
	}

	readyCallback() {
		// Called when component is on the DOM
	}

	destroyCallback() {
		// Called when component will be removed from the DOM
	}

	// oldValue and newValue are always strings as these are
	// attributes on the component. Use this.getAttribute
	// to get the typed value
	attributeChangedCallback(name, oldValue, newValue) {
	  this.send('my-output', newValue);
	}
}`;

export default {
	label: "New Node",
	text: t
};
