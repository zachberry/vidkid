import "./node-web-component-wrapper.css";

import React, { Component } from "react";

export default class NodeWebComponentWrapper extends Component {
	componentDidMount() {
		// 		this.props.nodeMap.setComponentInstance(this.props.node.id, this.refs.component);

		// 		let templateEl = document.createElement("template");
		// 		templateEl.innerHTML = `<div>
		// 	<select id="select"></select><button>Press me</button>
		// </div>`;
		// 		this.refs.component.init(this.props.node.id, this.props.nodeMapAdapter, templateEl);
		// 		this.refs.component.readyCallback();

		this.refs.self.appendChild(this.props.node.componentInstance);
		this.props.node.componentInstance.readyCallback();
		this.props.nodeMap.setInitialValues(this.props.node.id);
	}

	componentWillUnmount() {
		// Ensure that the web component disconnectedCallback is fired:
		// if (this.componentEl && this.componentEl.parentElement) {
		// 	this.componentEl.parentElement.removeChild(this.componentEl);
		// }
		this.props.node.componentInstance.destroyCallback();
	}

	// onClick(event) {
	// 	this.setState({
	// 		name: "Updated"
	// 	});
	// }

	render() {
		// console.log("WRAPPER RENDER", this.props);
		// let C = this.props.node.tagName;
		// debugger;
		// let c = this.props.node.component;
		// let C = new c();
		// let T = this.props.node.tagName;
		// return <div>{<T />}</div>;
		return (
			<div
				className={
					"node-web-component-wrapper" +
					(this.props.isTemplated ? " is-templated" : " is-not-templated")
				}
				ref="self"
			/>
		);
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
