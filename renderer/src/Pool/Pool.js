import React, { Component } from 'react';
import './Pool.css';
import Drop from '../Drop/Drop.js';
import uniqid from 'uniqid';
const electron = window.require('electron');
const ipc  = electron.ipcRenderer;

class Pool extends Component {
	constructor(props) {
		super(props);
		this.state = {
			drops: this.props.createDrops(this.props.size),
		};
	}	
	
	/*
	createDrops(size) {
		var drops = []
		for (var i = 0; i < size; i++) {
			var drop = {
				id: uniqid(), 
				index: (i+1), //lua is 1-indexed
				value: 0,
				active: false,
				type: 'note'
			}
			drops.push(drop);
		}
		return drops;
	}
	*/
	handleValueChange(dropIndex, newValue) {
		ipc.send('drop-value-change', [this.props.id, dropIndex, newValue]);
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
				{this.state.drops.map( drop => 
					<Drop 
						key={drop.id} 
						id={drop.id}
						index={drop.index} 
						value={drop.value} 
						active={drop.active} 
						type={drop.type} 
						poolId={this.props.id}
						handleValueChange={this.handleValueChange.bind(this)}
					/> 
				)}
			</div>
		);
	}
}

export default Pool;

