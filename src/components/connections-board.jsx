import "./connections-board.css";

import React, { Component } from "react";
import ReactDOM from "react-dom";

import Events from "../events";
import Cable from "../components/cable";

const getDOMElement = (type, id) => {
	let el = window.document.querySelector(`*[data-${type}-id="${id}"]`);

	return !el ? null : el;
};

class ConnectionsBoard extends Component {
	constructor() {
		super();

		// this.boundOnNodeMoved = this.onNodeMoved.bind(this);
		this.boundOnCableClick = this.onCableClick.bind(this);

		Events.on("connections:update", this.forceUpdate.bind(this, null));
	}

	onCableClick(connection) {
		this.props.docState.doAction({
			type: "selectConnection",
			from: connection.fromPort,
			to: connection.toPort
		});
	}

	componentDidUpdate() {
		Events.emit("cable:update");
	}

	render() {
		this.connections = [];

		let selectedConnection = this.props.docState.selectedConnection || {};

		for (let from in this.props.docState.nodeMap.portMap) {
			let fromEl = getDOMElement("output", from);
			let toConnections = this.props.docState.nodeMap.portMap[from];

			for (let to in toConnections) {
				let toEl = getDOMElement("input", to);

				this.connections.push({
					fromEl,
					toEl,
					fromPort: from,
					toPort: to
				});
			}
		}

		return (
			<div className="connections-board">
				{this.connections.map((connection, index) => {
					let isSelected =
						connection.fromPort === selectedConnection.from &&
						connection.toPort === selectedConnection.to;

					return (
						<Cable
							isSelected={isSelected}
							key={connection.fromPort + "->" + connection.toPort}
							index={index}
							connection={connection}
							boardEl={ReactDOM.findDOMNode(this)}
							onClick={this.boundOnCableClick}
						/>
					);
				})}
			</div>
		);
	}
}

export default ConnectionsBoard;
