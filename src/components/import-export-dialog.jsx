import "./import-export-dialog.css";

import React, { Component } from "react";

import Events from "../events";

class ImportExportDialog extends Component {
	constructor(props) {
		super(props);

		this.state = {
			text: props.text || ""
		};
	}

	updateText(event) {
		this.setState({
			text: event.target.value
		});
	}

	onClickClose() {
		Events.emit("importExportDialog:close");
	}

	onClickImport() {
		Events.emit("importExportDialog:import", JSON.parse(this.state.text));
	}

	render() {
		switch (this.props.mode) {
			case "import":
				return this.renderImport();
			case "export":
				return this.renderExport();
			default:
				return null;
		}
	}

	renderImport() {
		return (
			<div className="import-export-dialog import">
				<p>Paste:</p>
				<textarea
					autocomplete="off"
					autocorrect="off"
					autocapitalize="off"
					spellcheck="false"
					ref="textarea"
					onChange={this.updateText.bind(this)}
				>
					{this.state.text}
				</textarea>
				<button className="close-button" onClick={this.onClickClose.bind(this)}>
					&times;
				</button>
				<button className="import-button" onClick={this.onClickImport.bind(this)}>
					Import
				</button>
			</div>
		);
	}

	componentDidMount() {
		setTimeout(() => {
			this.refs.textarea.focus();
			this.refs.textarea.select();
		});
	}

	renderExport() {
		return (
			<div className="import-export-dialog export">
				<p>Copy:</p>
				<textarea
					autocomplete="off"
					autocorrect="off"
					autocapitalize="off"
					spellcheck="false"
					ref="textarea"
					onChange={this.updateText.bind(this)}
				>
					{this.state.text}
				</textarea>
				<button className="close-button" onClick={this.onClickClose.bind(this)}>
					&times;
				</button>
				<button className="ok-button" onClick={this.onClickClose.bind(this)}>
					OK
				</button>
			</div>
		);
	}
}

export default ImportExportDialog;
