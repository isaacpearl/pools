import React, { Component } from 'react';
import './Event.css';

class Event extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.id,
			behavior: this.props.behavior,
			pools: this.props.pools,
			terminatesBlock: this.props.terminatesBlock,
			index: this.props.index, 
			args: this.getArgs(this.props.func), 
		}	
	}
	
	//TODO: refactor so that this is passed down from PoolsApp,
	//so event state doesn't change here
	handleChange(event) {
		switch(event.target.className) {
			default:
				break;
			case 'behavior':
				const newValue = event.target.value;
				this.setState({behavior: newValue})
				break;
		}
	}

	getArgs(func) {
		var args = {};
		switch(func) {
			default:
				break;
  			case 'to':
				//TODO: rethink these defaults
				args = {
					destination: 1,
					time: 1,
					shape: 'linear'
				};
				break;
		}
		return args;
	}

	render() {
		return (
			<div className={"event " + this.props.func}>
				<p></p>
				<span className="func-name">{this.props.func} </span> 	
				<span className="args">({Object.keys(this.state.args).map(arg => `${arg} ` )}) </span> 	
				<span>behavior: </span>
				<select className="behavior" value={this.state.behavior} onChange={this.handleChange.bind(this)}>
					<option value="step">step</option>
					<option value="rand">random</option>
				</select>
				<span className="index">index: {this.state.index} </span> 	
				<span>pool: </span>
				<select className="event-pools" value={this.state.pool} onChange={this.handleChange.bind(this)}>
					{this.props.pools.map(
						pool => <option key= {pool.id} value={pool.symbol}>{pool.symbol}</option> 
					)}
				</select>
				<br></br>
				<button className="remove-event" onClick={this.props.removal}>-</button>	
			</div>
		);
	}
}

export default Event;

