import "./toolbar.css";

import React, { Component } from "react";

import Events from "../events";

class Toolbar extends Component {
	onClickInitState() {
		Events.emit("toolbar:initState");
	}

	// undo() {
	// 	Events.emit("toolbar:undo");
	// }

	// redo() {
	// 	Events.emit("toolbar:redo");
	// }

	onClickEditPage() {
		Events.emit("toolbar:editPage");
	}

	onClickExport() {
		Events.emit("toolbar:export");
	}

	onClickImport() {
		Events.emit("toolbar:import");
	}

	render() {
		return (
			<div className="toolbar">
				{/* <button onClick={this.onClickUndo}>Undo</button>
				<button onClick={this.onClickRedo}>Redo</button> */}
				<button onClick={this.onClickEditPage}>Edit Screen</button>
				<button onClick={this.onClickExport}>Export</button>
				<button onClick={this.onClickImport}>Import</button>
				<button onClick={this.onClickInitState}>Initalize</button>
			</div>
		);
	}
}

export default Toolbar;
