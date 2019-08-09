import React, { Component } from 'react';
import './Pool.css';
import Drop from '../Drop/Drop.js';
import uniqid from 'uniqid';

class Pool extends Component {
	constructor(props) {
		super(props);
		this.state = {
			drops: this.createDrops(this.props.size),
		};
	}	

	createDrops(size) {
		var drops = []
		for (var i = 0; i < size; i++) {
			var drop = {
				id: uniqid(), 
				value: 0,
				active: false,
				type: 'note'
			}
			drops.push(drop);
		}
		return drops;
	}

	addDrops(drops) {	
	}
	removeDrops(drops) {
	}

	drawSymbol(sym) {
		return sym + ' ';
	}

	render() {
		return (
			<div className="Pool">
				<span className="symbol">{this.drawSymbol(this.props.symbol)}</span>
				{this.state.drops.map( drop => <Drop key={drop.id} value={drop.value} active={drop.active} type={drop.type} /> )}
			</div>
		);
	}
}

export default Pool;

