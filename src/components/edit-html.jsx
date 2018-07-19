import "./edit-html.css";

import React, { Component } from "react";
import AceEditor from "react-ace";

import "brace/mode/html";
import "brace/mode/css";
import "brace/theme/monokai";

// import App from '../App';
import writeToIframe from "../util/write-to-iframe";

class EditHTML extends Component {
	constructor(props) {
		super(props);

		this.state = {
			html: props.html || "",
			css: props.css || ""
		};
	}

	onChangeHTML(html) {
		this.setState({
			html
		});

		this.updatePreview();

		if (this.props.onChange) this.props.onChange(this.getValues());
	}

	onChangeCSS(css) {
		this.setState({
			css
		});

		this.updatePreview();

		if (this.props.onChange) this.props.onChange(this.getValues());
	}

	updatePreview() {
		writeToIframe(this.refs.iframe, this.state.html, this.state.css);
	}

	componentDidMount() {
		this.updatePreview();
	}

	getValues() {
		return this.state;
	}

	render() {
		return (
			<div className="edit-html">
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
					<iframe title="preview" ref="iframe" />
				</div>
			</div>
		);
	}
}

export default EditHTML;
