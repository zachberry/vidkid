const t = `class CSSFilter extends N {
	static get inputs() {
	  return [
			{
				name: 'chain-id',
				observe: true,
				defaultValue: '',
				restrict: String
			},
			{
				name: 'type',
				observe: true,
				defaultValue: 'grayscale',
				restrict: N.set(['blur', 'brightness', 'contrast', 'grayscale', 'hue-rotate', 'invert', 'opacity', 'saturate', 'sepia'])
			},
			{
				name: 'amount',
				observe: true,
				defaultValue: 0,
				restrict: Number
			}
		]
	}

	static get outputs() {
	  return ['chain-id']
	}

	getCSSRule(type, amount) {
		switch(type)
		{
			case 'blur': return "blur(" + amount + "px)"
			case 'brightness': return "brightness(" + amount + "%)"
			case 'contrast': return "contrast(" + amount + "%)"
			case 'grayscale': return "grayscale(" + amount + "%)"
			case 'hue-rotate': return "hue-rotate(" + amount + "deg)"
			case 'invert': return "invert(" + amount + "%)"
			case 'opacity': return "opacity(" + amount + "%)"
			case 'saturate': return "saturate(" + amount + "%)"
			case 'sepia': return "sepia(" + amount + "%)"
			default: return null
		}
	}

	inputDisconnectedCallback(name) {
		if(name === 'chain-id')
		{
			this.releaseChain(this.getAttribute('chain-id'))
			this.setAttribute('chain-id', '')
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {
		let rule = this.getCSSRule(this.getAttribute('type'), this.getAttribute('amount'))
		if(!rule) return

		let chain = this.getChain(this.getAttribute('chain-id'))
		chain.set(this.id, rule);

		this.send('chain-id', chain.id);
	}

	destroyCallback() {
		this.releaseChain(this.getAttribute('chain-id'))
	}
}`;

export default {
	label: "CSS Filter",
	text: t
};
