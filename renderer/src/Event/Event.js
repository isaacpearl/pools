import React, { Component } from 'react';
import './Event.css';

class Event extends Component {
	constructor(props) {
		super(props);
		this.state = {
			behavior: 'step',
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

	getConnectedPools(pools) {
		
	}
	
	render() {
		return (
			<div className={"event " + this.props.func}>
				<p></p>
				<span className="func-name">{this.props.func} </span> 	
				<span className="args">({Object.keys(this.state.args).map(arg => `${arg} ` )}) </span> 	
				<span>behavior: </span>
				<select className="behavior"value={this.state.behavior} onChange={this.handleChange.bind(this)}>
					<option value="step">step</option>
					<option value="rand">random</option>
				</select>
				<span className="index">index: {this.state.index} </span> 	
				<span className="event-pools">pools: {this.getConnectedPools(this.state.pools)} </span>
			</div>
		);
	}
}

export default Event;

