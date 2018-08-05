import "./main-menu.css";

import React from "react";

import Toolbar from "./toolbar";
import logo from "./logo.svg";

class MainMenu extends React.Component {
	render() {
		return (
			<div className="main-menu">
				<span className="logo">
					<img src={logo} />
					VidKid
				</span>
				<Toolbar />
			</div>
		);
	}
}

export default MainMenu;
