import "./modal.css";

import React, { Component } from "react";

class Modal extends Component {
	render() {
		if (!this.props.children) return null;

		return (
			<div className="modal">
				<div ref="container" className="container">
					{this.props.children}
				</div>
			</div>
		);
	}
}

export default Modal;
