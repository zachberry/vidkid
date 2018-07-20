import "./file.css";

import React from "react";
// import ReactDOM from 'react-dom';

// import drag from '../drag';

export default class File extends React.Component {
	constructor(props) {
		super(props);

		this.boundOnChange = this.onChange.bind(this);
	}

	onChange(event) {
		let file = event.target.files[0];
		let url = URL.createObjectURL(file);

		this.props.onChange(url);

		// The resulting base64 blob is too huge!
		// let xhr = new XMLHttpRequest();
		// xhr.responseType = "blob";

		// xhr.onload = () => {
		// 	let blob = xhr.response;
		// 	let reader = new FileReader();

		// 	reader.onload = () => {
		// 		this.props.onChange(reader.result);
		// 	};

		// 	reader.readAsDataURL(blob);
		// };
		// console.log("file", file, url);

		// xhr.open("GET", url);
		// xhr.send();
	}

	render() {
		let value = this.props.value !== null ? this.props.value : "";
		return (
			<div className="file">
				<input className="input" onChange={this.boundOnChange} type="file" />
			</div>
		);
	}
}
