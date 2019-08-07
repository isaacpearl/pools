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

	//where does this get called from?
	connectPool(pool) {
		this.setState(prevState => {
			let pools = Object.assign({}, prevState.pools); // creating copy of state
  			pools.symbol = pool; // update the pool property, add a new value                 
  			return { pools };
		});
	}
	
	//this should maybe be passed in from EventsContainer
	disconnectPool(pool) {

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

	//TODO: check the contents of PoolsContainer for current pools?
	getAvailablePools() {

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
				<span className="event-pools">pools: </span>
				<button className="remove-event" onClick={this.props.removal}>-</button>	
			</div>
		);
	}
}

export default Event;

