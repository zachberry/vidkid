import "./menu.css";

import React from "react";

export default class Menu extends React.Component {
	static get defaultProps() {
		return {
			items: [],
			selectedIndex: null,
			highlightedIndex: null,
			onClick: function() {}
		};
	}

	render() {
		return (
			<ul className="menu">
				{this.props.items.map(
					function(item, index) {
						return (
							<li
								className={
									(this.props.selectedIndex === index ? "is-selected" : "is-not-selected") +
									" " +
									(this.props.highlightedIndex === index ? "is-highlighted" : "is-not-highlighted")
								}
								key={index}
								onClick={this.props.onClick.bind(this, item)}
							>
								{item.label}
							</li>
						);
					}.bind(this)
				)}
			</ul>
		);
	}
}
