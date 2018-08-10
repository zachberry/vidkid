import "./zoom-controls.css";

import React from "react";

class ZoomControls extends React.Component {
	render() {
		return (
			<div className={"zoom-controls"}>
				<button className="zoom-in" onClick={this.props.onZoomIn}>
					+
				</button>
				<button className="zoom-out" onClick={this.props.onZoomOut}>
					-
				</button>
			</div>
		);
	}
}

export default ZoomControls;
