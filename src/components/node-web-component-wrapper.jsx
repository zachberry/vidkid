import "./node.css";

import React, { Component } from "react";
import ReactDOM from "react-dom";

export default class NodeWebComponentWrapper extends Component {
	constructor(props) {
		super(props);

		// this.state = {
		// 	name: "MyComp"
		// };
	}

	componentDidMount() {
		this.props.nodeMap.setComponentInstance(this.props.node.id, this.refs.component);

		let templateEl = document.createElement("template");
		templateEl.innerHTML = `<div>
	<select id="select"></select><button>Press me</button>
</div>`;
		this.refs.component.init(this.props.node.id, this.props.nodeMapAdapter, templateEl);
		this.refs.component.readyCallback();
	}

	componentWillUnmount() {
		// Ensure that the web component disconnectedCallback is fired:
		// if (this.componentEl && this.componentEl.parentElement) {
		// 	this.componentEl.parentElement.removeChild(this.componentEl);
		// }
		this.refs.component.destroyCallback();
	}

	// onClick(event) {
	// 	this.setState({
	// 		name: "Updated"
	// 	});
	// }

	render() {
		console.error("WRAPPER RENDER", this.props);
		let C = this.props.node.tagName;
		// debugger;
		// let c = this.props.node.component;
		// let C = new c();
		// let T = this.props.node.tagName;
		// return <div>{<T />}</div>;
		return <div>{<C ref="component" />}</div>;
	}

	// renderFAIL() {
	// 	let C = this.props.node.component;
	// 	// let c = new C();
	// 	return <div>{<C ref="component" />}</div>;
	// }

	// render() {
	// 	console.error("WRAPPER RENDER");
	// 	return ReactDOM.createPortal()
	// }

	// renderTEST() {
	// 	console.error("WRAPPER RENDER", this.props);

	// 	// let inputs = Object.values(this.props.node.node.inputs);
	// 	// console.log("nnn", this.props);

	// 	return (
	// 		<div>
	// 			{/* <div key={"t" + this.props.node.node.tagName}>{this.props.node.node.tagName}</div>
	// 			<div key={this.props.node.node.tagName} ref="container" className="component-container" /> */}
	// 		</div>
	// 	);
	// }
}
