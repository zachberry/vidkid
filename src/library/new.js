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
		let p = document.createElement('p');
		p.id = 'p'
		p.innerText = Date.now();
		this.root.appendChild(p);
	}

	fn() {
		console.log('beep')
		this.root.getElementById('p').innerText = Date.now()
	}

	destroyCallback() {
		clearInterval(this.intervalId)
	}

	attributeChangedCallback(name, oldValue, newValue) {
	  this.send('my-output', newValue);
	}

	connectedCallback() {
		// Ran when component created
		console.log('CONN' + this.id);
		// let p = document.createElement('p');
		// p.innerText = Date.now();
		// this.root.appendChild(p);
	}

	disconnectedCallback() {
		// Ran when component destroyed
		console.error('DISCON' + this.id);
	}
}`;

export default {
	label: "New Node",
	text: t
};
