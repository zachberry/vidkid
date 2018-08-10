import "./range.css";

import React from "react";

export default class Range extends React.Component {
	constructor(props) {
		super(props);

		this.boundOnChange = this.onChange.bind(this);
	}

	onChange(event) {
		this.props.onChange(parseFloat(event.target.value));
	}

	render() {
		let opts = this.props.opts;
		let restrict = this.props.restrict;

		let min = opts.min || opts.min === 0 ? opts.min : restrict.min;
		let max = opts.max || opts.max === 0 ? opts.max : restrict.max;
		let step = opts.step;

		return (
			<div className={"range"}>
				<input
					disabled={!opts.editable}
					className="slider"
					type="range"
					value={this.props.value}
					min={min}
					max={max}
					step={step}
					onChange={this.boundOnChange}
				/>

				<input
					disabled={!opts.editable}
					className="input"
					type="number"
					value={this.props.value}
					onChange={this.boundOnChange}
					min={min}
					max={max}
					step={step}
				/>
			</div>
		);
	}
}
