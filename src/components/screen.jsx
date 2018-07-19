import "./screen.css";

import React, { Component } from "react";

import Events from "../events";
import writeToIframe from "../util/write-to-iframe";

class Screen extends Component {
	constructor(props) {
		super(props);

		this.state = {
			width: 100,
			height: 100,
			html: props.pageHTML,
			css: props.pageCSS
		};

		this.boundsetFullscreen = this.setFullscreen.bind(this);
	}

	setFullscreen() {
		this.props.setFullscreen(!this.props.fullscreen);
	}

	componentDidMount() {
		this.updateIframe();
	}

	componentDidUpdate() {
		console.log("IFRAME DID UPDATE", this.needsIframeUpdate);
		if (this.needsIframeUpdate) {
			delete this.needsIframeUpdate;
			this.updateIframe();
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			nextProps.pageHTML !== this.state.html ||
			nextProps.pageCSS !== this.state.css ||
			nextProps.fullscreen !== this.props.fullscreen
		);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.pageHTML !== this.state.html || nextProps.pageCSS !== this.state.css) {
			this.needsIframeUpdate = true;

			this.setState({
				html: nextProps.pageHTML,
				css: nextProps.pageCSS
			});
		}
	}

	updateIframe() {
		console.log("UPDOOT IFRAME");
		writeToIframe(this.refs.iframe, this.state.html, this.state.css);
		Events.emit("screen:iframeUpdated");
	}

	render() {
		return (
			<div
				id="screen"
				ref="main"
				className={"screen " + (this.props.fullscreen ? "fullscreen" : "mini")}
			>
				<iframe title="preview" ref="iframe" id="--app--screen" />
				<button onClick={this.boundsetFullscreen}>
					{this.props.fullscreen ? "Minimize" : "Fullscreen"}
				</button>
			</div>
		);
	}
}

export default Screen;
