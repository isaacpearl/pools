import React, { Component } from 'react';
import './Event.css';

class Event extends Component {
	constructor(props) {
		super(props);
		this.state = {
			behavior: this.props.behavior,
			pools: {},
			terminatesBlock: false, //is it the last event in a block?
			index: 1, //lua tables are 1-indexed
			args: this.getArgs(this.props.func), 
		}	
	}

	componentDidMount() {
				
	}

	componentWillUnmount() {
		
	}

	getArgs(func) {
		var args = {};
		switch(func) {
  			case 'to':
				//TODO: rethink these defaults
				args = {
					d: 1,
					t: 1,
					s: 'linear'
				};
				break;
		}
		return args;
	}

	getConnectedPools(pools) {
		
	}
	
	render() {
		return (
			<div className="Event">
				<p></p>
				<span className="func-name">{this.props.func} </span> 	
				<span className="args">({Object.keys(this.state.args).map(arg => `${arg} = ${this.state.args[arg]} ` )}) </span> 	
				<span className="behavior">behavior: {this.state.behavior} </span> 	
				<span className="index">index: {this.state.index} </span> 	
				<span className="event-pools">pools: {this.getConnectedPools(this.state.pools)} </span>
			</div>
		);
	}
}

export default Event;

