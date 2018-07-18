import "./range.css";

import React, { Component } from "react";

export default class Range extends React.Component {
	constructor(props) {
		super(props);

		this.boundOnChange = this.onChange.bind(this);
	}

	onChange(event) {
		this.props.onChange(parseFloat(event.target.value));
	}

	render() {
		let min = this.props.opts.min !== null ? this.props.opts.min : this.props.restrict.min;
		let max = this.props.opts.max !== null ? this.props.opts.max : this.props.restrict.max;
		let step = this.props.opts.step;

		return (
			<div className={"range"}>
				<input
					disabled={!this.props.opts.editable}
					className="slider"
					type="range"
					value={this.props.value}
					min={min}
					max={max}
					step={step}
					onChange={this.boundOnChange}
				/>

				<input
					disabled={!this.props.opts.editable}
					className="input"
					type="number"
					value={this.props.value}
					onChange={this.boundOnChange}
					min={min}
					max={max}
				/>
			</div>
		);
	}
}
