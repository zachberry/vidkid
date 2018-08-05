const t = `class ValueBoolean extends N {
	static get inputs() {
		return [
			  {
				  name: 'value',
				  observe: true,
				  defaultValue: false,
				  restrict: Boolean
			  }
		  ]
	  }

	  static get outputs() {
		return ['value']
	  }

	  onAttrChanged(name, oldValue, newValue) {
		this.send('value', this.getAttribute('value'));
	  }
}`;

export default {
	label: "Value Boolean",
	text: t
};
