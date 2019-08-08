import React, { Component } from 'react';
import './EventsContainer.css';
import Event from '../Event/Event.js';
import uniqid from 'uniqid';

class EventsContainer extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="events-container">
				Events: 
				<button className="add-event" onClick={this.props.addEvent.bind(this)}>+</button>
				{this.props.events.map(
					(event) => {
						return <Event 
							key={event.id} 
							id={event.id} 
							func={event.func} 
							behavior={event.behavior} 
							connectedPools={event.connectedPools} 
							terminatesBlock={event.terminatesBlock} 
							index={event.index} 
							removal={this.props.removeEvent.bind(this, event)}
							pools={this.props.pools}
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

