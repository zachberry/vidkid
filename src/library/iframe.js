const t = `class IFrame extends N {
	static get type() { return N.SCREEN }

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

	onDestroy() {
		if(this.el) this.el.src = 'about:blank';
		this.el = null;
	}

	onScreenUpdated() {
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

	onAttrChanged(name, oldValue, newValue) {
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
