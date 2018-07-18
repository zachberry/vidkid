import "./toggle.css";

import React, { Component } from "react";
// import ReactDOM from 'react-dom';

// import drag from '../drag';

export default class Toggle extends React.Component {
	constructor(props) {
		super(props);

		this.boundOnChange = this.onChange.bind(this);
	}

	onChange(event) {
		this.props.onChange(event.target.checked);
	}

	render() {
		return (
			<div className="toggle">
				<label>
					<input
						disabled={!this.props.opts.editable}
						type="checkbox"
						checked={this.props.value}
						onChange={this.boundOnChange}
					/>
					<span>{this.props.value ? "True" : "False"}</span>
				</label>
			</div>
		);
	}
}
