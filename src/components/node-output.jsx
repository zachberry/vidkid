import "./node-port.css";

import React, { Component } from "react";

export default class NodeOutput extends Component {
	render() {
		return (
			<div className="node-output node-port">
				<div className="label" onClick={this.props.onClickPort}>
					{this.props.output}
				</div>
				<div data-output-id={this.props.node.id + "." + this.props.output} className="port" />
			</div>
		);
	}
}
