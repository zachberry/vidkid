import "./edit-node.css";

import React, { Component } from "react";
import AceEditor from "react-ace";
import brace from "brace";
import Events from "../events";

import "brace/mode/javascript";
import "brace/theme/monokai";

// import App from '../App';

class EditNode extends Component {
	constructor(props) {
		super(props);

		// this.nodeText = "";
		// return;

		this.nodeText = this.props.docState.nodeMap.byId[this.props.nodeId].text;
	}

	onChange(s) {
		//console.log('change', s, this.props.modelId)
		//@TODO - instead of onChange just get it when we save and close?
		this.nodeText = s;
		// console.log(this.refs.aceEditor.editor.getSession().$annotations)
	}

	cancel() {
		this.props.docState.doAction({
			type: "stopEditingNode"
		});
	}

	save() {
		if (this.nodeText === null) return true;

		let successOrError = this.props.docState.doAction({
			type: "updateNodeText",
			text: this.nodeText
		});

		//this.refs.aceEditor.editor.getSession().$annotations

		if (successOrError !== true)
			Events.emit("app:error", "Unable to save: " + successOrError, successOrError);

		this.refs.aceEditor.editor.focus();

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
		this.refs.aceEditor.editor.focus();
	}

	render() {
		// console.log('EditNode render', this.nodeText)
		return (
			<div className="edit-node">
				<button onClick={this.cancel.bind(this)}>Cancel</button>
				<button onClick={this.save.bind(this)}>Save</button>
				<button onClick={this.saveAndClose.bind(this)}>Save + Close</button>
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
		);
	}
}

export default EditNode;
