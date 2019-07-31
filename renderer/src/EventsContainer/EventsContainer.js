import React, { Component } from 'react';
import './EventsContainer.css';
import Event from '../Event/Event.js';

class EventsContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
		
		};
	}
	componentDidMount() {

	}

	componentWillUnmount() {

	}

	render() {
		return (
			<div className="events-container">
				<Event/> 	
			</div>
		);
	}
}

export default EventsContainer;

