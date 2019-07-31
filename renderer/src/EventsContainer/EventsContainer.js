import React, { Component } from 'react';
import './EventsContainer.css';
import Event from '../Event/Event.js';

class EventsContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			events: this.props.events,		
		};
	}

	componentDidMount() {

	}

	componentWillUnmount() {

	}

	addEvent(event) {

	}

	removeEvent(event) {

	}

	render() {
		return (
			<div className="events-container">
				Events: 
				{this.state.events.map(
					event => <Event func={event.func} behavior={event.behavior}/>
				)}
			</div>
		);
	}
}

export default EventsContainer;

