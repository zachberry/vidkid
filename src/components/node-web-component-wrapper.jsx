import "./node-web-component-wrapper.css";

import React, { Component } from "react";
import Events from "../events";

export default class NodeWebComponentWrapper extends Component {
	componentDidMount() {
		this.refs.self.appendChild(this.props.node.componentInstance);
		try {
			this.props.node.componentInstance.onReady();
		} catch (e) {
			Events.emit(
				"app:error",
				this.props.node.componentInstance.id + " onReady error: " + e.message
			);
		}
		this.props.nodeMap.setInitialValues(this.props.node.id);
		this.props.nodeMap.restoreNodeConnections(this.props.node.id);
		Events.emit("app:update");
	}

	componentWillUnmount() {
		try {
			this.props.node.componentInstance.onDestroy();
		} catch (e) {
			Events.emit(
				"app:error",
				this.props.node.componentInstance.id + " onDestroy error: " + e.message
			);
		}
	}

	render() {
		return (
			<div
				className={
					"node-web-component-wrapper" +
					(this.props.isTemplated ? " is-templated" : " is-not-templated")
				}
				ref="self"
			/>
		);
	}
}
