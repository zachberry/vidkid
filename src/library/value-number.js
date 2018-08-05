const t = `class ValueNumber extends N {
	static get inputs() {
		return [
			  {
				  name: 'value',
				  observe: true,
				  defaultValue: 0,
				  restrict: Number
			  }
		  ]
	  }

	  static get outputs() {
		return ['value']
	  }

	  onAttrChanged(name, oldValue, newValue) {
		this.send('value', newValue);
	  }
}`;

export default {
	label: "Value Number",
	text: t
};
