import "./node-board.css";

import React from "react";
import ReactDOM from "react-dom";

import Node from "./node";
import drag from "../util/drag";
import Events from "../events";
import NodeLibrary from "../library/all";
import NodeSearchMenu from "./node-search-menu";

const DEFAULT_OFFSET = 20;

class NodeBoard extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			contextMenuCoords: null,
			newNodeOffset: DEFAULT_OFFSET
		};

		this.boundOnDragMoveNode = this.onDragMoveNode.bind(this);
		this.boundDragComplete = this.onDragNodeComplete.bind(this);
		this.boundOnContextMenu = this.onContextMenu.bind(this);
		this.boundOnClick = this.onClick.bind(this);
		this.boundOnSearchMenuItemSelect = this.onSearchMenuItemSelect.bind(this);
		this.boundOnSearchMenuClose = this.onSearchMenuClose.bind(this);
		this.boundUpdateTransform = this.updateTransform.bind(this);
		// this.boundIsInputUIOpen = this.props.docState.isInputUIOpen.bind(this.props.docState);
	}

	onClick(event) {
		this.unselectConnectionIfNeeded();
		this.props.docState.doAction({
			type: "abortConnection"
		});
	}

	onContextMenu(event) {
		if (event.target !== this.refs.board) return;

		event.preventDefault();

		this.setState({
			contextMenuCoords: {
				x: event.nativeEvent.offsetX,
				y: event.nativeEvent.offsetY
			}
		});

		this.unselectConnectionIfNeeded();
	}

	unselectConnectionIfNeeded() {
		if (this.props.docState.selectedConnection) {
			this.props.docState.doAction({
				type: "unselectConnection"
			});
		}
	}

	onSearchMenuItemSelect(menuItem) {
		console.log("osm", menuItem);
		this.props.docState.doAction({
			type: "createNode",
			text: menuItem.text,
			templateHTML: menuItem.templateHTML,
			templateCSS: menuItem.templateCSS,
			x: this.state.contextMenuCoords.x + this.state.newNodeOffset,
			y: this.state.contextMenuCoords.y + this.state.newNodeOffset
		});

		this.setState({
			newNodeOffset: this.state.newNodeOffset + DEFAULT_OFFSET
		});
	}

	onSearchMenuClose() {
		this.setState({
			contextMenuCoords: null,
			newNodeOffset: DEFAULT_OFFSET
		});
	}

	onStartDragNode(node) {
		drag(
			ReactDOM.findDOMNode(this.refs[node.id]),
			this.boundOnDragMoveNode,
			this.boundDragComplete,
			node
		);
		this.props.docState.doAction({
			type: "moveNodeToTop",
			id: node.id
		});
	}

	onDragMoveNode(el, pt, newLocation, node) {
		//@TODO: This is wasteful:
		Events.emit("cable:update");
	}

	onDragNodeComplete(el, movedAmount, newLocation, node) {
		this.props.docState.doAction({
			type: "moveNode",
			id: node.id,
			x: newLocation.x,
			y: newLocation.y
		});
	}

	onEditNode(node) {
		this.props.docState.doAction({
			type: "editNode",
			id: node.id
		});
	}

	onCopyNode(node, event) {
		event.stopPropagation();

		this.props.docState.doAction({
			type: "copyNode",
			id: node.id
		});
	}

	onDeleteNode(node) {
		this.props.docState.doAction({
			type: "removeNode",
			id: node.id
		});
	}

	onUserSetValue(node, input, value) {
		this.props.docState.setAttribute(node.id, input.name, value, false);
	}

	onOpenInputControl(node, input) {
		this.props.docState.doAction({
			type: "openInputControl",
			id: node.id,
			name: input.name
		});
	}

	onCloseInputControl(node, input) {
		this.props.docState.doAction({
			type: "closeInputControl",
			id: node.id,
			name: input.name
		});
	}

	onOpenUserTransform(node, input) {
		this.props.docState.doAction({
			type: "openInputUserTransform",
			id: node.id,
			name: input.name
		});
	}

	onCloseUserTransform(node, input) {
		this.props.docState.doAction({
			type: "closeInputUserTransform",
			id: node.id,
			name: input.name
		});
	}

	onClickPort(node, portType, portName, event) {
		event.preventDefault();
		event.stopPropagation();

		this.props.docState.doAction({
			type: "connect",
			portType: portType,
			id: node.id,
			name: portName
		});
	}

	onClickNode(node) {
		this.props.docState.doAction({
			type: "moveNodeToTop",
			id: node.id
		});
	}

	updateTransform(node, input, text) {
		console.log("ut", node, input, text);
		this.props.docState.doAction({
			type: "setTransform",
			id: node.id,
			name: input.name,
			text
		});
	}

	componentDidUpdate() {
		// console.log("NODE BOARD CDU");
		Events.emit("connections:update");
	}

	render() {
		return (
			<div
				className={
					"node-board is-connecting-type-" +
					this.props.connectingType +
					(this.props.connectingType === null ? " is-not-connecting" : " is-connecting")
				}
				onContextMenu={this.boundOnContextMenu}
				onClick={this.boundOnClick}
				ref="board"
			>
				{this.props.nodeOrder.map(nodeId => {
					let node = this.props.nodes[nodeId];

					return (
						<Node
							node={node}
							ref={node.id}
							key={node.id + "-" + node.rev}
							nodeMap={this.props.nodeMap}
							getAttribute={this.props.getAttribute}
							onStartDrag={this.onStartDragNode.bind(this, node)}
							onClickEdit={this.onEditNode.bind(this, node)}
							onClickCopy={this.onCopyNode.bind(this, node)}
							onClickDelete={this.onDeleteNode.bind(this, node)}
							onEdit={this.onEditNode.bind(this, node)}
							onUserSetValue={this.onUserSetValue.bind(this, node)}
							updateTransform={this.updateTransform.bind(this, node)}
							docState={this.props.docState}
							onOpenInputControl={this.onOpenInputControl.bind(this, node)}
							onCloseInputControl={this.onCloseInputControl.bind(this, node)}
							onOpenUserTransform={this.onOpenUserTransform.bind(this, node)}
							onCloseUserTransform={this.onCloseUserTransform.bind(this, node)}
							onClickPort={this.onClickPort.bind(this, node)}
							onClick={this.onClickNode.bind(this, node)}
						/>
					);
				})}
				{this.state.contextMenuCoords ? (
					<div
						className="menu-container"
						style={{ left: this.state.contextMenuCoords.x, top: this.state.contextMenuCoords.y }}
					>
						<NodeSearchMenu
							initialAllItems={NodeLibrary}
							onItemSelect={this.boundOnSearchMenuItemSelect}
							onClose={this.boundOnSearchMenuClose}
						/>
					</div>
				) : null}
			</div>
		);
	}
}

export default NodeBoard;
