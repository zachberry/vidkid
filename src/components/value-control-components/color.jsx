import "./color.css";

import React, { Component } from "react";
// import ReactDOM from 'react-dom';

// import drag from '../drag';

export default class Color extends React.Component {
	constructor(props) {
		super(props);

		this.boundOnChange = this.onChange.bind(this);
	}

	onChange(event) {
		this.props.onChange(event.target.value);
	}

	render() {
		return (
			<div className="color">
				<label style={{ background: this.props.value }}>
					<input
						disabled={!this.props.opts.editable}
						type="color"
						className="color-input"
						value={this.props.value}
						onChange={this.boundOnChange}
					/>
				</label>
				<input
					disabled={!this.props.opts.editable}
					type="text"
					className="text-input"
					value={this.props.value}
					onChange={this.boundOnChange}
				/>
			</div>
		);
	}
}
