import React, { Component } from 'react';
import './EventsContainer.css';
import Event from '../Event/Event.js';

//for good modulo behavior
Number.prototype.mod = function(n) {
	return ((this%n)+n)%n;
}

class EventsContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			colors: ['red', 'yellow', 'blue'],
		}
	}
	
	getColor(eventId) {
		var eventColorHash = 0;
		//retrieve color with id as input to hash function here
		return this.state.colors[eventColorHash]
	}
	
	render() {
		return (
			<div className="events-container">
				Events: 
				<button className="add-event" onClick={this.props.addEvent.bind(this, "note")}>+</button>
				{Object.keys(this.props.events).map(
					(eventKey) => {
						var event = this.props.events[eventKey] 
						return <Event 
							key={event.id} 
							id={event.id} 
							func={event.func} 
							args={this.props.getArgs(event.func)}
							behavior={event.behavior} 
							connectedPools={event.connectedPools} 
							terminatesBlock={event.terminatesBlock} 
							index={event.index} 
							color={this.getColor(event)}
							removal={this.props.removeEvent.bind(this, event)}
							pools={this.props.pools}
							poolSymbols={this.props.poolSymbols}
							handleBehaviorChange={this.props.handleBehaviorChange.bind(this, event)}
							handlePoolChange={this.props.handlePoolChange.bind(this, event)}
						/>
					}
				)}
			</div>
		);
	}
}

export default EventsContainer;

