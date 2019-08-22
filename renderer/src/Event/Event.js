import React, { Component } from 'react';
import './Event.css';

//TODO: utilize currently unused color prop

class Event extends Component {
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
				};
				break;
			case 'note':
				args = {
					destination: 1,
					time: 1
				};
		}
		return args;
	}

	handleChange(event) {
		console.log("handling change");
		const newValue = event.target.value;
		if (newValue == "") {
			return;
		}
		switch(event.target.className) {
			default:
				break;
			case 'behavior':
				this.props.handleBehaviorChange(newValue);
				break;
			case 'event-pools':
				var newPoolId = this.props.poolSymbols[newValue];
				this.props.handlePoolChange(newPoolId);
				break;
		}
	}
	
	render() {
		return (
			<div className={`event ${this.props.func} ${this.props.color}`}>
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
					<option value={""}>select pool</option>
					{Object.keys(this.props.pools).map(
						poolKey => {
							var pool = this.props.pools[poolKey];
							return <option key={pool.id} value={pool.symbol}>{pool.symbol}</option>
						} 
					)}
				</select>
				<br></br>
				<button className="remove-event" onClick={this.props.removal}>-</button>	
			</div>
		);
	}
}

export default Event;

