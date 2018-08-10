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

		this.state = {
			mouseX: -1,
			mouseY: -1
		};
		this.boundOnCableClick = this.onCableClick.bind(this);
		this.boundOnMouseMove = this.onMouseMove.bind(this);
		this.boundOnKeyUp = this.onKeyUp.bind(this);

		Events.on("connections:update", this.forceUpdate.bind(this, null));
	}

	shouldComponentUpdate() {
		return this.props.docState.shouldDisplayUpdate;
	}

	onKeyUp(event) {
		if (event.keyCode === 27) {
			this.props.docState.doAction({
				type: "abortConnection"
			});
		}
	}

	onMouseMove(event) {
		this.setState({
			mouseX: event.clientX,
			mouseY: event.clientY
		});
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

	componentWillReceiveProps(nextProps) {
		if (nextProps.isConnecting !== this.props.isConnecting) {
			if (nextProps.isConnecting) {
				window.addEventListener("mousemove", this.boundOnMouseMove);
				window.addEventListener("keyup", this.boundOnKeyUp);
			} else {
				window.removeEventListener("mousemove", this.boundOnMouseMove);
				window.removeEventListener("keyup", this.boundOnKeyUp);
				this.setState({
					mouseX: -1,
					mouseY: -1
				});
			}
		}
	}

	render() {
		let docState = this.props.docState;
		this.connections = [];

		let selectedConnection = docState.selectedConnection || {};

		for (let from in docState.nodeMap.portMap) {
			let fromEl = getDOMElement("output", from);
			let toConnections = docState.nodeMap.portMap[from];

			for (let to in toConnections) {
				let toEl = getDOMElement("input", to);

				this.connections.push({
					isComplete: true,
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
