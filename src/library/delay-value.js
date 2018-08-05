const t = `class DelayValue extends N {
	static get inputs() {
	  return [
			{
				name: 'in',
				observe: true,
				defaultValue: null,
				restrict: null,
				control: N.button()
			},
			{
				name: 'high-value',
				observe: false,
				defaultValue: 1,
				restrict: Number
			},
			{
				name: 'low-value',
				observe: false,
				defaultValue: 0,
				restrict: Number
			},
			{
				name: 'delay',
				observe: false,
				defaultValue: 200,
				restrict: N.int(0),
				control: N.range({ min:0, max:10000, step:10})
			}
		]
	}

	static get outputs() {
	  return ['out']
	}

	onDestroy() {
		window.clearTimeout(this.timeoutId);
	}

	onAttrChanged(name, oldValue, newValue) {
		let high = this.getAttribute('high-value')
		let low = this.getAttribute('low-value')
		let delay = this.getAttribute('delay')

		window.clearTimeout(this.timeoutId);

		this.send('out', high);
		this.timeoutId = setTimeout(() => {
			this.send('out', low)
		}, delay)
	}
}`;

export default {
	label: "Delay Value",
	text: t
};
