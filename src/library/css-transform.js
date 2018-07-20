const t = `class CSStransform extends N {
	static get inputs() {
	  return [
			{
				name: 'transform-string',
				observe: true,
				defaultValue: '',
				restrict: String
			},
			{
				name: 'type',
				observe: true,
				defaultValue: 'rotate',
				restrict: N.set(['rotate', 'translateX', 'translateY', 'scale', 'scaleX', 'scaleY'])
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
	  return ['transform-string']
	}

	cssTransformStringToArray(css) {
		if (css.length === 0) return []

		return css.split('|').map(pair => {
			let tokens = pair.split(':')
			return {
				id: tokens[0],
				style: tokens[1]
			}
		})
	}

	cssArrayToTransformString(array) {
		return array.map(o => o.id + ':' + o.style).join('|')
	}

	getStyleIndex(array) {
		for (let i = 0, len = array.length; i < len; i++) {
			if (array[i].id === this.id) {
				return i;
			}
		}

		return null;
	}

	getCSSRule(type, amount) {
		switch(type)
		{
			case 'rotate': return "rotate(" + amount + "deg)"
			case 'scale': return "scale(" + amount + ")"
			case 'scaleX': return "scaleX(" + amount + ")"
			case 'scaleY': return "scaleY(" + amount + ")"
			case 'translateX': return "translateX(" + amount + "%)"
			case 'translateY': return "translateY(" + amount + "%)"
			default: return null
		}
	}

	inputDisconnectedCallback(name) {
		if(name === 'transform-string')
		{
			this.setAttribute('transform-string', '')
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {
		let arr = this.cssTransformStringToArray(this.getAttribute('transform-string'))
		let index = this.getStyleIndex(arr);
		if(index === null) index = arr.length;

		let rule = this.getCSSRule(this.getAttribute('type'), this.getAttribute('amount'))

		if(!rule) return

		arr[index] = {
			id: this.id,
			style: rule
		}

		let transformString = this.cssArrayToTransformString(arr);

		this.send('transform-string', transformString);
	}
}`;

export default {
	label: "CSS Transform",
	text: t
};
