import "./cable.css";

import React, { Component } from "react";

import Events from "../events";
// import App from '../App';

// import getValueComponent from '../values/get-value-component'
// import TransformDialog from './transform-dialog'

class Cable extends Component {
	constructor() {
		super();

		this.boundOnClick = this.onClick.bind(this);
		this.boundOnMouseOver = this.setState.bind(this, { hover: true }, null);
		this.boundOnMouseOut = this.setState.bind(this, { hover: false }, null);

		this.state = {
			hover: false
		};

		Events.on("cable:update", this.updateRender.bind(this));
	}

	updateRender() {
		// 		fromEl
		// :
		// div.output
		// fromPort
		// :
		// "n1.0"
		// toEl
		// :
		// div.input
		// toPort
		// :
		// "n0.0"
		let w;
		let h;
		let hw;
		let left;
		let top;
		let transform = "";

		if (
			!this.props.connection.fromEl ||
			(this.props.connection.isComplete && !this.props.connection.toEl) ||
			!this.refs.path
		)
			return;

		let boardBBox = this.props.boardEl.getBoundingClientRect();
		let fromBBox = this.props.connection.fromEl.getBoundingClientRect();
		let toBBox;

		if (this.props.connection.isComplete) {
			toBBox = this.props.connection.toEl.getBoundingClientRect();
		} else {
			toBBox = {
				left: this.props.connectingMouseX - 5,
				top: this.props.connectingMouseY - 5,
				width: 0,
				height: 0
			};
		}

		if (fromBBox.left < toBBox.left && fromBBox.top < toBBox.top) {
			/*
			[FROM]*
					*[TO]
			*/

			// top: fromBBox.top - boardBBox.top,
			// 	left: fromBBox.left - boardBBox.left + fromBBox.width,

			left = fromBBox.left + fromBBox.width - 10;
			top = fromBBox.top;

			w = toBBox.left - left + 10;
			h = toBBox.top - fromBBox.top + 9.5;
			// hw = w / 2
			// this.refs.path.setAttribute('d', `M0,0 C${hw},0 ${hw},${h} ${w},${h}`)
		} else if (fromBBox.left >= toBBox.left && fromBBox.top < toBBox.top) {
			/*
					*[FROM]
			[TO]*
			*/
			left = toBBox.left + toBBox.width - 10;
			top = fromBBox.top;

			transform = "rotateX(180deg)";

			w = fromBBox.left - left + 10;
			h = toBBox.top - fromBBox.top + 9.5;
			// hw = w / 2
			// this.refs.path.setAttribute('d', `M0,0 C${hw},0 ${hw},${h} ${w},${h}`)
		} else if (fromBBox.left < toBBox.left && fromBBox.top >= toBBox.top) {
			/*
					*[TO]
			[FROM]*
			*/
			left = fromBBox.left + fromBBox.width - 10;
			top = toBBox.top;

			transform = "rotateY(180deg)";

			w = toBBox.left - left + 10;
			h = fromBBox.top - toBBox.top + 9.5;
		} else {
			/*
			[TO]*
					*[FROM]
			*/
			left = toBBox.left + toBBox.width - 10;
			top = toBBox.top;

			w = fromBBox.left - left + 10;
			h = fromBBox.top - toBBox.top + 9.5;
			// hw = w / 2
		}

		hw = w / 2;
		this.refs.path.setAttribute("d", `M5,5 C${hw},0 ${hw},${h - 5} ${w - 5},${h - 5}`);
		this.refs.pathBg.setAttribute("d", `M5,5 C${hw},0 ${hw},${h - 5} ${w - 5},${h - 5}`);

		this.refs.svg.style.left = left - boardBBox.left + "px";
		this.refs.svg.style.top = top - boardBBox.top + "px";
		this.refs.svg.style.width = w + "px";
		this.refs.svg.style.height = h + "px";
		this.refs.svg.style.transform = transform;

		this.refs.end.setAttribute("cx", w - 5);
		this.refs.end.setAttribute("cy", h - 5);

		//
		// [ ] --> [ ]
		//
	}

	onClick() {
		this.props.onClick(this.props.connection);
	}

	render() {
		// console.log(this.props.connection)
		if (!this.props.connection.isComplete && (this.props.mouseX === -1 || this.props.mouseY === -1))
			return null;

		return (
			<svg
				ref="svg"
				data-connection-index={this.props.index}
				className={
					"cable" +
					(this.props.isSelected ? " is-selected" : " is-not-selected") +
					(this.state.hover ? " is-hover" : " is-not-hover") +
					(this.props.connection.isComplete ? " is-complete" : " is-not-complete")
				}
				preserveAspectRatio="none"
			>
				<path
					className="path-bg"
					ref="pathBg"
					onClick={this.boundOnClick}
					onMouseOver={this.boundOnMouseOver}
					onMouseOut={this.boundOnMouseOut}
					vectorEffect="non-scaling-stroke"
					strokeWidth="10"
					fill="none"
					stroke="none"
				/>
				<circle
					ref="start"
					cx="5"
					cy="5"
					r="5"
					fill="#ffe501"
					onMouseOver={this.boundOnMouseOver}
					onMouseOut={this.boundOnMouseOut}
					onClick={this.boundOnClick}
				/>
				<circle
					ref="end"
					r="5"
					fill="#ffe501"
					onMouseOver={this.boundOnMouseOver}
					onMouseOut={this.boundOnMouseOut}
					onClick={this.boundOnClick}
				/>
				<path
					className="path"
					ref="path"
					vectorEffect="non-scaling-stroke"
					strokeWidth="3"
					fill="none"
					stroke="#ffe501"
				/>
			</svg>
		);
	}
}

export default Cable;
