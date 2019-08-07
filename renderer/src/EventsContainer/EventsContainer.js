import React, { Component } from 'react';
import './EventsContainer.css';
import Event from '../Event/Event.js';
import uniqid from 'uniqid';

class EventsContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			events: [],		
		};
	}

	addEvent() {
		var event = {
			id : uniqid(),
			func: "to",
			behavior: "step",
			pools: {},
			terminatesBlock: false,
			index: 1,
			
		};
		this.setState(prevState => {
			prevState.events.push(event);
			return prevState.events;
		});	
	}

	removeEvent(event) {
		console.log(`removing event ${event.id}`);
		var filteredEvents = this.state.events.filter(function( e ) {
    		return e.id !== event.id;
		});
		this.setState({events: filteredEvents});
	}

	render() {
		return (
			<div className="events-container">
				Events: 
				<button className="add-event" onClick={this.addEvent.bind(this)}>+</button>
				{this.state.events.map(
					(event) => {
						return <Event key={event.id} id={event.id} func={event.func} behavior={event.behavior} pools={event.pools} terminatesBlock={event.terminatesBlock} index={event.index} removal={this.removeEvent.bind(this, event)}/>
					}
				)}
			</div>
		);
	}
}

export default EventsContainer;

