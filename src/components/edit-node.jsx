import "./edit-node.css";

import React, { Component } from "react";
import AceEditor from "react-ace";
// import brace from "brace";
import Events from "../events";

import "brace/mode/javascript";
import "brace/theme/monokai";

import EditHTML from "./edit-html";

// import App from '../App';

class EditNode extends Component {
	constructor(props) {
		super(props);

		// this.nodeText = "";
		// return;

		let node = this.props.docState.nodeMap.byId[this.props.nodeId];

		this.state = {
			mode: "js",
			templateHTML: node.templateHTML,
			templateCSS: node.templateCSS
		};

		this.nodeText = node.text;
	}

	isEditorReportingErrors() {
		let annotations = this.refs.aceEditor.editor.getSession().$annotations;
		for (let i = 0, len = annotations.length; i < len; i++) {
			if (annotations[i].type === "error") return true;
		}

		return false;
	}

	onChange(s) {
		this.nodeText = s;
	}

	cancel() {
		this.props.docState.doAction({
			type: "stopEditingNode"
		});
	}

	save() {
		if (this.nodeText === null) return true;

		if (this.isEditorReportingErrors()) {
			Events.emit("app:error", "Unable to save: Check JS code");
			return false;
		}

		let successOrError = this.props.docState.doAction({
			type: "updateNodeText",
			text: this.nodeText,
			templateHTML: this.state.templateHTML,
			templateCSS: this.state.templateCSS
		});

		//this.refs.aceEditor.editor.getSession().$annotations

		if (successOrError !== true)
			Events.emit("app:error", "Unable to save: " + successOrError, successOrError);

		this.focus();

		return successOrError;
	}

	saveAndClose() {
		if (this.save() === true) {
			this.props.docState.doAction({
				type: "stopEditingNode"
			});
		}
	}

	componentDidMount() {
		this.focus();
	}

	focus() {
		if (this.state.mode === "js") this.refs.aceEditor.editor.focus();
	}

	onTemplateChange(templateValues) {
		this.setState({
			templateHTML: templateValues.html,
			templateCSS: templateValues.css
		});
	}

	render() {
		console.log("EditNode render", this.state);
		return (
			<div className="edit-node">
				<header>
					<button
						disabled={this.state.mode === "js"}
						onClick={this.setState.bind(this, { mode: "js" }, null)}
						className="js-button"
					>
						JS
					</button>
					<button
						disabled={this.state.mode === "html-css"}
						onClick={this.setState.bind(this, { mode: "html-css" }, null)}
						className="html-css-button"
					>
						HTML &amp; CSS
					</button>
				</header>
				<div>
					{this.state.mode === "js" ? (
						<div className="js">
							<AceEditor
								ref="aceEditor"
								mode="javascript"
								theme="monokai"
								onChange={this.onChange.bind(this)}
								name="ace-editor"
								fontSize={14}
								width={"100%"}
								height={"100%"}
								value={this.nodeText}
							/>
						</div>
					) : (
						<div className="html-css">
							<EditHTML
								onChange={this.onTemplateChange.bind(this)}
								ref="editHTML"
								html={this.state.templateHTML}
								css={this.state.templateCSS}
							/>
						</div>
					)}
				</div>
				<button className="cancel-button" onClick={this.cancel.bind(this)}>
					&times;
				</button>
				<div className="button-container">
					<button className="save-button" onClick={this.save.bind(this)}>
						Save
					</button>
					<button className="save-and-close-button" onClick={this.saveAndClose.bind(this)}>
						Save &amp; Close
					</button>
				</div>
			</div>
		);
	}
}

export default EditNode;
