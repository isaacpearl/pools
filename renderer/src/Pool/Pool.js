import React, { Component } from 'react';
import './Pool.css';
import Drop from '../Drop/Drop.js';
import uniqid from 'uniqid';
const electron = window.require('electron');
const ipc  = electron.ipcRenderer;

class Pool extends Component {
	constructor(props) {
		super(props);
	}	
	
	drawSymbol(sym) {
		return sym + ' ';
	}

	render() {
		return (
			<div className="Pool">
				<span className="symbol">{this.drawSymbol(this.props.symbol)}</span>
				{this.props.drops.map( drop => 
					<Drop 
						key={drop.id} 
						id={drop.id}
						index={drop.index} 
						value={drop.value} 
						active={drop.active} 
						type={drop.type} 
						poolId={this.props.id}
						handleValueChange={this.props.handleDropValueChange.bind(this)}
					/> 
				)}
			</div>
		);
	}
}

export default Pool;

