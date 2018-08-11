import "./node.css";

import React, { Component } from "react";

import NodeInput from "./node-input";
import NodeOutput from "./node-output";
import NodeWebComponentWrapper from "./node-web-component-wrapper";

export default class Node extends Component {
	shouldComponentUpdate() {
		return this.props.docState.shouldDisplayUpdate;
	}

	render() {
		let pos = this.props.docState.getNodePosition(this.props.node.id);
		let x = pos[0];
		let y = pos[1];

		return (
			<div
				data-node-id={this.props.node.id}
				className={"node is-type-" + this.props.node.type}
				onMouseOver={this.boundOnMouseOver}
				onMouseOut={this.boundOnMouseOut}
				onClick={this.props.onClick}
				style={{
					left: x + "px",
					top: y + "px"
				}}
			>
				<header>
					<span className="name" onMouseDown={this.props.onStartDrag}>
						{this.props.node.component.name}
					</span>
					<span className="id">{this.props.node.id}</span>
					<div className="controls">
						<button className="edit-button" onClick={this.props.onClickEdit}>
							✎
						</button>
						<button className="copy-button" onClick={this.props.onClickCopy}>
							⎌
						</button>
						<button className="delete-button" onClick={this.props.onClickDelete}>
							&times;
						</button>
					</div>
				</header>
				<span className="inputs ports">
					{this.props.node.inputsList.map(input => {
						if (!input.visible) return null;
						console.log("input", input);
						return (
							<NodeInput
								node={this.props.node}
								input={input}
								value={this.props.getAttribute(this.props.node.id, input.name)}
								key={input.name}
								onUserSetValue={this.props.onUserSetValue.bind(null, input)}
								updateTransform={this.props.updateTransform.bind(null, input)}
								// isConnected={this.props.docState.nodeMap.isInputConnected(
								// 	this.props.node.id,
								// 	input.name
								// )}
								isControlOpen={this.props.docState.isInputUIOpen(
									"control",
									this.props.node.id,
									input.name
								)}
								onOpenControl={this.props.onOpenInputControl.bind(null, input)}
								onCloseControl={this.props.onCloseInputControl.bind(null, input)}
								isUserTransformOpen={this.props.docState.isInputUIOpen(
									"userTransform",
									this.props.node.id,
									input.name
								)}
								onOpenUserTransform={this.props.onOpenUserTransform.bind(null, input)}
								onCloseUserTransform={this.props.onCloseUserTransform.bind(null, input)}
								onClickPort={this.props.onClickPort.bind(null, "input", input.name)}
							/>
						);
					})}
				</span>
				<span className="outputs ports">
					{this.props.node.outputs.map(output => {
						return (
							<NodeOutput
								node={this.props.node}
								output={output}
								key={output}
								onClickPort={this.props.onClickPort.bind(null, "output", output)}
							/>
						);
					})}
				</span>
				<div key={this.props.node.tagName} ref="container" className="component-container">
					<NodeWebComponentWrapper
						node={this.props.node}
						isTemplated={this.props.node.templateHTML}
						nodeMap={this.props.docState.nodeMap}
					/>
				</div>
			</div>
		);
	}
}
