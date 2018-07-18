import "./node-input-user-transform-dialog.css";

import React, { Component } from "react";

export default class NodeInputUserTransformDialog extends Component {
	constructor(props) {
		super(props);

		this.state = {
			transformText: this.props.transformText || ""
		};

		this.boundOnKeyUp = this.onKeyUp.bind(this);
		this.boundOnChange = this.onChange.bind(this);
		this.boundUpdateTransform = this.updateTransform.bind(this);
	}

	onKeyUp(event) {
		switch (event.keyCode) {
			case 13:
				this.updateTransform();
				break;

			case 27:
				this.props.onCloseUserTransform();
				break;
		}
	}

	onChange(event) {
		this.setState({
			transformText: event.target.value
		});
	}

	componentDidMount() {
		this.refs.input.focus();
	}

	updateTransform() {
		this.props.updateTransform(this.state.transformText);
	}

	render() {
		return (
			<div className="node-input-user-transform-dialog">
				<div className="user-transform">
					<span>f(x)=</span>
					<input
						value={this.state.transformText}
						onChange={this.boundOnChange}
						onKeyUp={this.boundOnKeyUp}
						ref="input"
						type="text"
						placeholder="x"
					/>
					<button onClick={this.boundUpdateTransform} className="update-transform-button">
						Set
					</button>
				</div>
				{/* <div className="value">{component}</div> */}
				<button className="close-button" onClick={this.props.onCloseUserTransform}>
					&times;
				</button>
			</div>
		);
	}
}
