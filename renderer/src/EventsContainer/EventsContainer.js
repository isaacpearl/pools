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
			eventToAddFunc: "note"
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
				<select onChange={(e) => this.setState({ eventToAddFunc: e.target.value })}>
    				<option value="note">note()</option>
    				<option value="toward">to()</option>
				</select>
				<button className="add-event" onClick={this.props.addEvent.bind(this, this.state.eventToAddFunc)}>+</button>
				{Object.keys(this.props.events).map(
					(eventKey) => {
						var event = this.props.events[eventKey] 
						return <Event 
							key={event.id} 
							id={event.id} 
							func={event.func} 
							args={event.args}
							behavior={event.behavior} 
							connectedPools={event.connectedPools} 
							terminatesBlock={event.terminatesBlock} 
							index={event.index} 
							color={this.getColor(event)}
							removal={this.props.removeEvent.bind(this, event)}
							pools={this.props.pools}
							poolSymbols={this.props.poolSymbols}
							behaviors={this.props.behaviors}
							handleBehaviorChange={this.props.handleBehaviorChange.bind(this, event)}
							handlePoolChange={this.props.handlePoolChange.bind(this)}
						/>
					}
				)}
			</div>
		);
	}
}

export default EventsContainer;

