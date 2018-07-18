import "./main-menu.css";

import React, { Component } from "react";
import ReactDOM from "react-dom";

import Toolbar from "./toolbar";

class MainMenu extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="main-menu">
				<span className="logo">⚡VidKid</span>
				<Toolbar />
			</div>
		);
	}
}

export default MainMenu;
