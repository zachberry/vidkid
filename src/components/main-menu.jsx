import "./main-menu.css";

import React from "react";

import Toolbar from "./toolbar";

class MainMenu extends React.Component {
	render() {
		return (
			<div className="main-menu">
				<span className="logo">
					<span role="img" aria-label="bolt">
						⚡
					</span>VidKid
				</span>
				<Toolbar />
			</div>
		);
	}
}

export default MainMenu;
