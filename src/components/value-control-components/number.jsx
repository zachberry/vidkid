import "./number.css";

import React from "react";

export default class Number extends React.Component {
	constructor(props) {
		super(props);

		this.boundOnChange = this.onChange.bind(this);
	}

	onChange(event) {
		this.props.onChange(parseFloat(event.target.value));
	}

	render() {
		let step = this.props.opts.step;

		return (
			<div className="number">
				<input
					disabled={!this.props.opts.editable}
					className="input"
					type="number"
					value={this.props.value}
					step={step}
					onChange={this.boundOnChange}
				/>
			</div>
		);
	}
}
