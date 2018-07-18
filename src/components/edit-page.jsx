import "./edit-page.css";

import React, { Component } from "react";
import AceEditor from "react-ace";
import brace from "brace";

import "brace/mode/html";
import "brace/mode/css";
import "brace/theme/monokai";

// import App from '../App';
import writeToIframe from "../util/write-to-iframe";

class EditPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			html: props.html,
			css: props.css
		};
		// this.nodeText = this.props.docState.nodeMap.getNodeById(this.props.modelId).nodeText;
	}

	onChangeHTML(html) {
		this.setState({
			html
		});

		// document.getElementById('iframe').src = 'data:text/html;charset=utf-8,' + encodeURI(html);

		// document.getElementById('screen').innerHTML = s
		this.updatePreview();
	}

	onChangeCSS(css) {
		this.setState({
			css
		});

		this.updatePreview();
	}

	onClickCancel() {
		this.props.docState.doAction({
			type: "stopEditingPage"
		});
	}

	onClickSave() {
		this.props.docState.doAction({
			type: "updatePage",
			html: this.state.html,
			css: this.state.css
		});
		this.props.docState.doAction({
			type: "stopEditingPage"
		});
	}

	updatePreview() {
		// let iframe = this.refs.iframe
		// iframe.contentWindow.document.open()
		// iframe.contentWindow.document.write(this.state.html)
		// iframe.contentWindow.document.close()

		// let style = iframe.contentWindow.document.createElement('style')

		// style.innerText = this.state.css
		// iframe.contentWindow.document.head.innerHTML = ''
		// iframe.contentWindow.document.head.appendChild(style)
		writeToIframe(this.refs.iframe, this.state.html, this.state.css);
	}

	componentDidMount() {
		this.updatePreview();
	}

	render() {
		// console.log('EditNode render', this.nodeText)
		return (
			<div className="edit-page">
				<div className="main">
					<div className="html container">
						<h1>HTML</h1>
						<AceEditor
							mode="html"
							theme="monokai"
							onChange={this.onChangeHTML.bind(this)}
							name="html-edit"
							fontSize={13}
							wrapEnabled={true}
							value={this.state.html}
							width={"100%"}
							height={"inherit"}
						/>
					</div>
					<div className="css container">
						<h1>CSS</h1>
						<AceEditor
							mode="css"
							theme="monokai"
							onChange={this.onChangeCSS.bind(this)}
							name="css-edit"
							fontSize={13}
							wrapEnabled={true}
							value={this.state.css}
							width={"100%"}
							height={"inherit"}
						/>
					</div>
					<div className="preview container">
						<h1>Preview</h1>
						<iframe ref="iframe" />
					</div>
				</div>
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
