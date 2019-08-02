import React, { Component } from 'react';
import './EventsContainer.css';
import Event from '../Event/Event.js';

class EventsContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			//TODO: refactor events to be an object with unique IDs
			events: [],		
		};
	}

	addEvent() {
		console.log("adding event");
		var event = {func: "to"};
		this.setState(prevState => {
			prevState.events.push(event);
			return prevState.events;
		});	
	}

	removeEvent(event) {
		console.log("removing event");
	}

	render() {
		//rewrite this mapping so that each child gets a unique key
		return (
			<div className="events-container">
				Events: 
				<button className="add-event" onClick={this.addEvent.bind(this)}>+</button>
				{this.state.events.map(
					event => <Event func={event.func} behavior={event.behavior}/>
				)}
			</div>
		);
	}
}

export default EventsContainer;

