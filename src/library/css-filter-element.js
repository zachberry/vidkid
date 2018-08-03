const t = `class CSSFilterElement extends N {
	static get type() { return N.SCREEN }

	static get inputs() {
		return [
			{
				name: "chain-id",
				observe: true,
				defaultValue: "",
				restrict: String
			},
			{
				name: "selector",
				observe: true,
				defaultValue: "body",
				restrict: String
			}
		];
	}

	getEl(selector) {
		try {
			return this.screen.querySelector(selector);
		} catch (e) {
			return null;
		}
	}

	setFilter(selector, filterText) {
		let el = this.getEl(selector);
		if (el) el.style.filter = filterText;
	}

	inputDisconnectedCallback(name) {
		if(name === 'chain-id')
		{
			this.setAttribute('chain-id', '')
		}
	}

	getCSSFilterString(chainId) {
		let chain = this.getChain(chainId);
		if(!chain) return ''

		return chain.get().join(' ')
	}

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case "selector":
				this.setFilter(oldValue, '');
				this.setFilter(newValue, this.getCSSFilterString(this.getAttribute("chain-id")));
				break;

			case "chain-id":
				this.setFilter(this.getAttribute('selector'), this.getCSSFilterString(newValue));
				break;
		}
	}
}`;

export default {
	label: "CSS Filter Element",
	text: t
};
