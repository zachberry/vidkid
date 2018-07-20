import "./error-message.css";

import React, { Component } from "react";

import Events from "../events";

class ErrorMessage extends Component {
	render() {
		return (
			<div className="error-message" onClick={this.props.onDismiss}>
				<span>{this.props.message}</span>
			</div>
		);
	}
}

export default ErrorMessage;
