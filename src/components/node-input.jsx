import "./node-port.css";

import React, { Component } from "react";

import NodeInputUserTransformDialog from "./node-input-user-transform-dialog";
import getValueControlComponent from "./get-value-control-component";

const DEFAULT_RESTRICT = {};
const DEFAULT_CONTROL_OPTS = { editable: true };

export default class NodeInput extends Component {
	constructor(props) {
		super(props);

		this.boundOnClickExpand = this.onClickExpand.bind(this);
	}

	onClickExpand() {
		(this.props.isControlOpen ? this.props.onCloseControl : this.props.onOpenControl)();
	}

	render() {
		let ValueControlComponent = getValueControlComponent(
			this.props.input.control ? this.props.input.control.type : null,
			typeof this.props.value
		);
		let component = (
			<ValueControlComponent
				value={this.props.value}
				onChange={this.props.onUserSetValue}
				restrict={this.props.input.restrict || DEFAULT_RESTRICT}
				opts={this.props.input.control || DEFAULT_CONTROL_OPTS}
			/>
		);
		let transformText = this.props.node.transforms[this.props.input.name];
		return (
			<div className="node-input node-port">
				<div data-input-id={this.props.node.id + "." + this.props.input.name} className="port" />
				<div
					className={"transform" + (transformText ? " is-transform-set" : " is-not-transform-set")}
					onClick={this.props.onOpenUserTransform}
				/>
				<span
					className={"expand" + (this.props.isControlOpen ? " is-expanded" : " is-not-expanded")}
					onClick={this.boundOnClickExpand}
				>
					...
				</span>
				<div className="label" onClick={this.props.onClickPort}>
					{this.props.input.name + ":" + this.props.value}
				</div>
				{this.props.isControlOpen ? <div className="input-component">{component}</div> : null}
				{this.props.isUserTransformOpen ? (
					<NodeInputUserTransformDialog
						input={this.props.input}
						value={this.props.value}
						transformText={transformText}
						updateTransform={this.props.updateTransform}
						onCloseUserTransform={this.props.onCloseUserTransform}
					/>
				) : null}
			</div>
		);
	}
}
