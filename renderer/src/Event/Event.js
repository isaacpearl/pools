import React, { Component } from 'react';
import './Event.css';

class Event extends Component {
	constructor(props) {
		super(props);
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
	
	handleChange(event) {
		const newValue = event.target.value;
		switch(event.target.className) {
			default:
				break;
			case 'behavior':
				this.props.handleBehaviorChange(newValue);
				break;
			case 'event-pools':
				this.props.handlePoolChange(newValue);
				break;
		}
	}
	
	render() {
		return (
			<div className={"event " + this.props.func}>
				<p></p>
				<span className="func-name">{this.props.func} </span> 	
				<span className="args">({Object.keys(this.getArgs(this.props.func)).map(arg => `${arg} ` )}) </span> 	
				<span>behavior: </span>
				<select className="behavior" value={this.props.behavior} onChange={this.handleChange.bind(this)}>
					<option value="step">step</option>
					<option value="rand">random</option>
				</select>
				<span className="index">index: {this.props.index} </span> 	
				<span>pool: </span>
				<select className="event-pools" value={this.props.pool} onChange={this.handleChange.bind(this)}>
					{this.props.pools.map(
						pool => <option key={pool.id} value={pool.symbol}>{pool.symbol}</option> 
					)}
				</select>
				<br></br>
				<button className="remove-event" onClick={this.props.removal}>-</button>	
			</div>
		);
	}
}

export default Event;

