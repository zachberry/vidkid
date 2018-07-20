const t = `class IFrame extends N {
	static get inputs() {
		return [
			{
				name: "src",
				observe: true,
				restrict: String,
				defaultValue: "about:blank"
			},
			{
				name: "selector",
				observe: true,
				defaultValue: "iframe",
				restrict: String
			}
		];
	}

	destroyCallback() {
		if(this.el) this.el.src = 'about:blank';
		this.el = null;
	}

	screenUpdatedCallback() {
		let el = this.getVideoEl(this.getAttribute('selector'));
		if(el) {
			this.el = el;
			this.el.src = this.getAttribute('src');
		}
	}

	getVideoEl(selector) {
		try {
			let el = this.screen.querySelector(selector);
			if(el && el.tagName && el.tagName.toLowerCase() === 'iframe') return el;
		} catch(e) {
			return null;
		}

		return null;
	}

	attributeChangedCallback(name, oldValue, newValue) {
		switch(name)
		{
			case "src":
				if(!this.el || !newValue) return;
				this.el.src = newValue;
				break;

			case "selector":
				console.log('--V-->selector update', oldValue, newValue)

				this.el = null;

				let oldEl = this.getVideoEl(oldValue);
				if(oldEl) {

					oldEl.src = 'about:blank';
				}

				let newEl = this.getVideoEl(newValue);
				if(newEl) {
					this.el = newEl;
					this.el.src = this.getAttribute('src');
				}
		}
	}
}`;

export default {
	label: "IFrame",
	text: t
};
