const t = `class CSSFilter extends N {
	static get inputs() {
	  return [
			{
				name: 'filter-string',
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
	  return ['filter-string']
	}

	cssFilterStringToArray(css) {
		if (css.length === 0) return []

		return css.split('|').map(pair => {
			let tokens = pair.split(':')
			return {
				id: tokens[0],
				style: tokens[1]
			}
		})
	}

	cssArrayToFilterString(array) {
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
		if(name === 'filter-string')
		{
			this.setAttribute('filter-string', '')
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {
		let arr = this.cssFilterStringToArray(this.getAttribute('filter-string'))
		let index = this.getStyleIndex(arr);
		if(index === null) index = arr.length;

		let rule = this.getCSSRule(this.getAttribute('type'), this.getAttribute('amount'))

		if(!rule) return

		arr[index] = {
			id: this.id,
			style: rule
		}

		let filterString = this.cssArrayToFilterString(arr);

		this.send('filter-string', filterString);
	}
}`;

export default {
	label: "CSS Filter",
	text: t
};
