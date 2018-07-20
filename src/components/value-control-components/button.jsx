import "./button.css";

import React from "react";
// import ReactDOM from 'react-dom';

// import drag from '../drag';

export default class Button extends React.Component {
	constructor(props) {
		super(props);

		this.boundOnChange = this.onChange.bind(this);
	}

	onChange(event) {
		this.props.onChange(true);
	}

	render() {
		return (
			<div className="button">
				<button onClick={this.boundOnChange}>Trigger</button>
			</div>
		);
	}
}
