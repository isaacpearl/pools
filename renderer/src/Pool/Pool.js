import React, { Component } from 'react';
import './Pool.css';
import Drop from '../Drop/Drop.js';

class Pool extends Component {
	constructor(props) {
		super(props);
		this.state = {
			drops: new Array(this.props.size).fill(0),
			connections: []
		};
	}
	componentDidMount() {

	}

	componentWillUnmount() {

	}

	addDrops(drops) {
		
	}

	removeDrops(drops) {
		
	}

	drawSymbol(sym) {
		return sym;
	}

	render() {
		return (
			<div className="Pool">
				<span className="symbol">{this.drawSymbol(this.props.symbol)}</span>
				{this.state.drops.map( drop => <Drop value={drop}/> )}
			</div>
		);
	}
}

export default Pool;

