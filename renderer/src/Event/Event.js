import React, { Component } from 'react';
import './Event.css';

class Event extends Component {
	constructor(props) {
		super(props);
		this.state = {
			func: this.props.func,
			argTypes: this.props.argTypes,
			behavior: this.props.behavior,
			pools: {},
			terminatesBlock: false, //is it the last event in a block
			index: 1, //lua tables are 1-indexed
			argValues: {}, //TODO: write function to populate this and lastArgValues
			lastArgValues: {} //this may not be needed, my thinking as of now is to use it for defaults
		}	
	}

	componentDidMount() {
				
	}

	componentWillUnmount() {
		
	}

	getFunctionName(func) {
		return '';
	}

	getArgTypes(args) {
		return '';
	}

	getConnectedPools(pools) {
	
	}
	
	render() {
		return (
			<div className="Event">
				<div className="func-name">{this.getFunctionName(this.state.func)}</div> 	
				<div className="args">{this.getArgTypes(this.state.argTypes)}</div> 	
				<div className="behavior">{this.state.behavior}</div> 	
				<div className="index">{this.state.index}</div> 	
				<div className="event-pools">{this.getConnectedPools(this.state.pools)}</div>
			</div>
		);
	}
}

export default Event;

