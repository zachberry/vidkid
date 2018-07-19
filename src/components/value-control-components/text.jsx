import "./text.css";

import React from "react";
// import ReactDOM from 'react-dom';

// import drag from '../drag';

export default class String extends React.Component {
	constructor(props) {
		super(props);

		this.boundOnChange = this.onChange.bind(this);
	}

	onChange(event) {
		this.props.onChange(event.target.value);
	}

	render() {
		return (
			<div className="text">
				{this.props.opts.multiline ? (
					<textarea
						disabled={!this.props.opts.editable}
						value={this.props.value}
						onChange={this.boundOnChange}
					/>
				) : (
					<input
						disabled={!this.props.opts.editable}
						value={this.props.value}
						onChange={this.boundOnChange}
					/>
				)}
			</div>
		);
	}
}
