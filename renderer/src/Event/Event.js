import React, { Component } from 'react';
import './Event.css';

class Event extends Component {
	constructor(props) {
		super(props);
		this.state = {
			func: this.props.func,
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

	getArgTypes(func) {
		return '';
	}

	getConnectedPools(pools) {
		
	}
	
	render() {
		return (
			<div className="Event">
				<span className="func-name">{this.state.func}</span> 	
				<span className="args">({this.getArgTypes(this.state.func)})</span> 	
				<span className="behavior">behavior: {this.state.behavior}</span> 	
				<span className="index">index: {this.state.index}</span> 	
				<span className="event-pools">pools: {this.getConnectedPools(this.state.pools)}</span>
			</div>
		);
	}
}

export default Event;

