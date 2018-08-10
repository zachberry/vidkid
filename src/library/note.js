const N = require("../web-components/base-node").default;
class Note extends N {
	static get type() {
		return N.INFO;
	}

	static get inputs() {
		return [
			{
				name: "text",
				observe: false,
				restrict: String,
				visible: false
			}
		];
	}

	onReady() {
		this.boundOnInput = this.onInput.bind(this);
		this.root.getElementById("container").addEventListener("input", this.boundOnInput);

		let text = this.getAttribute("text");
		if (text) this.root.getElementById("container").innerHTML = text;
	}

	onInput(event) {
		console.log(">>onInput", event);
		this.setAttribute("text", event.target.innerHTML);
	}

	onAttrChanged(name, oldValue, newValue) {
		switch (name) {
			case "text":
				this.root.getElementById("container").innerHTML = newValue;
				break;
		}
	}
}

let html = '<div id="container" contenteditable>Click here to edit...</div>';
let css = "#container { width: 13em; }";

export default {
	label: "Note",
	text: Note.toString(),
	templateHTML: html,
	templateCSS: css
};
