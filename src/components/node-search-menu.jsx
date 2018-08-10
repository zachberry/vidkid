import "./node-search-menu.css";

import React from "react";
import Menu from "./menu";

export default class NodeSearchMenu extends React.Component {
	constructor(props) {
		super(props);

		this.boundOnItemSelect = this.onItemSelect.bind(this);

		this.state = {
			items: this.props.initialAllItems,
			searchTerm: "",
			selectedIndex: null,
			highlightedIndex: null
		};
	}

	componentDidMount() {
		this.focus();
	}

	componentDidUpdate() {
		if (this.state.selectedIndex === null) {
			this.refs.input.focus();
		} else {
			this.refs.hiddenInput.focus();
		}
	}

	focus() {
		setTimeout(() => {
			if (this.refs.input && this.refs.input.focus) {
				this.refs.input.focus();
			}
		});
	}

	onItemSelect(item, event) {
		this.props.onItemSelect(item);

		if (event.shiftKey) {
			this.focus();
		} else {
			this.props.onClose();
		}
	}

	onChangeSearchTerm() {
		let searchTerm = this.refs.input.value.toLowerCase();

		let filteredItems = this.props.initialAllItems.filter(item => {
			return item.label.toLowerCase().indexOf(searchTerm) !== -1;
		});

		this.setState({
			searchTerm: searchTerm,
			items: filteredItems
		});

		if (filteredItems.length === 1) {
			this.setState({
				highlightedIndex: 0
			});
		} else {
			this.setState({
				highlightedIndex: null
			});
		}
	}

	onKeyUp(event) {
		let items = this.state.items;

		switch (event.keyCode) {
			case 13: //enter
				if (this.state.selectedIndex !== null && items[this.state.selectedIndex]) {
					this.onItemSelect(items[this.state.selectedIndex], event);
				} else if (this.state.highlightedIndex !== null && items[this.state.highlightedIndex]) {
					this.onItemSelect(items[this.state.highlightedIndex], event);
				}
				break;

			case 27: //esc
				if (this.state.searchTerm === "") {
					this.props.onClose();
				} else {
					this.refs.input.value = "";
					this.onChangeSearchTerm();
				}
				break;

			case 38: //up arrow
				if (this.state.selectedIndex > 0) {
					this.setState({
						selectedIndex: this.state.selectedIndex - 1
					});
				} else {
					this.setState({
						selectedIndex: null
					});
				}
				break;

			case 40: //down arrow
				if (this.state.selectedIndex === null) {
					this.setState({
						selectedIndex: 0
					});
				} else if (this.state.selectedIndex < items.length - 1) {
					this.setState({
						selectedIndex: this.state.selectedIndex + 1
					});
				}
				break;

			default:
				if (this.state.selectedIndex !== null) {
					this.refs.input.value = this.refs.input.value + this.refs.hiddenInput.value;
					this.refs.hiddenInput.value = "";
					this.onChangeSearchTerm();
					this.setState({
						selectedIndex: null
					});
				}
		}
	}

	render() {
		return (
			<div className={"node-search-menu"}>
				<button className="close-button" onClick={this.props.onClose}>
					&times;
				</button>
				<input
					ref="input"
					type="text"
					className="search-field"
					value={this.state.searchTerm}
					onChange={this.onChangeSearchTerm.bind(this)}
					onKeyUp={this.onKeyUp.bind(this)}
				/>
				<input
					ref="hiddenInput"
					type="text"
					className="hidden-input"
					onKeyUp={this.onKeyUp.bind(this)}
				/>
				<Menu
					selectedIndex={this.state.selectedIndex}
					highlightedIndex={this.state.highlightedIndex}
					items={this.state.items}
					onClick={this.boundOnItemSelect}
				/>
			</div>
		);
	}
}
