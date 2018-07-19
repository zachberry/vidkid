import "./edit-page.css";

import React, { Component } from "react";

import EditHTML from "./edit-html";

class EditPage extends Component {
	onClickCancel() {
		this.props.docState.doAction({
			type: "stopEditingPage"
		});
	}

	onClickSave() {
		let values = this.refs.editHTML.getValues();

		this.props.docState.doAction({
			type: "updatePage",
			html: values.html,
			css: values.css
		});
		this.props.docState.doAction({
			type: "stopEditingPage"
		});
	}

	render() {
		return (
			<div className="edit-page">
				<EditHTML ref="editHTML" html={this.props.html} css={this.props.css} />
				<button className="cancel-button" onClick={this.onClickCancel.bind(this)}>
					&times;
				</button>
				<button className="save-and-close-button" onClick={this.onClickSave.bind(this)}>
					Save &amp; Close
				</button>
			</div>
		);
	}
}

export default EditPage;
