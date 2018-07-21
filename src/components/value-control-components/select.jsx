import "./select.css";

import React from "react";
// import ReactDOM from 'react-dom';

// import drag from '../drag';

export default class Select extends React.Component {
	constructor(props) {
		super(props);

		this.boundOnChange = this.onChange.bind(this);
	}

	onChange(event) {
		this.props.onChange(event.target.value);
	}

	render() {
		let value = this.props.value !== null ? this.props.value : "";
		return (
			<div className="select">
				<select value={value} onChange={this.boundOnChange}>
					[
					{this.props.value === null ? (
						<option key="--null--" value="">
							Select...
						</option>
					) : null},
					{this.props.restrict.valuesList.map((v, i) => {
						return (
							<option key={v} value={v}>
								{i + ":" + v}
							</option>
						);
					})}
					]
				</select>
			</div>
		);
	}
}
