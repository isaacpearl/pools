import React, { Component } from 'react';

import './PoolsApp.css';
import PoolsContainer from '../PoolsContainer/PoolsContainer.js';
import EventsContainer from '../EventsContainer/EventsContainer.js';
import InfoPanelsContainer from '../InfoPanelsContainer/InfoPanelsContainer.js';

import uniqid from 'uniqid';

const electron = window.require('electron');
//const fs = electron.remote.require('fs');
const ipc  = electron.ipcRenderer;

class PoolsApp extends Component {
	constructor(props) {
		super(props);
		// TODO: refactor pools (and events?) to be objects w symbol as key
		this.state = {
			events: [],
			pools: [
				{id: uniqid(), size: 8, symbol: 'X', connected: {}},
				{id: uniqid(), size: 8, symbol: 'O', connected: {}}
			]
		};
	}

	addEvent() {
		var event = {
			id : uniqid(),
			func: "to",
			behavior: "step",
			connectedPools: [],
			terminatesBlock: false,
			index: 1,
			color: ''
		};
		var prevEvents = this.state.events;
		prevEvents.push(event);
		this.setState({events: prevEvents});
		console.log(`added event ${event.id}`);
	}

	removeEvent(event) {
		var filteredEvents = this.state.events.filter(function( e ) {
    		return e.id !== event.id;
		});
		this.setState({events: filteredEvents});
		console.log(`removed event ${event.id}`);
	}

	connectPool(pool, event) {
		console.log(`connecting pool ${pool} to event ${event.id}`);
		var poolsCopy = this.state.pools;
		for (var i = 0; i < poolsCopy.length; i++) {
			console.log(`current symbol: ${poolsCopy[i].symbol}`);
			console.log(`current value of pool: ${pool}`);
			if (poolsCopy[i].symbol === pool) {
				poolsCopy[i].connected[event.id] = event;
			} 
			else if (poolsCopy[i].connected[event.id] === event) {
				delete poolsCopy[i].connected[event.id]; // removes event.id property in this pool
			}

		}
		this.setState({pools: poolsCopy});
	}
	
	handleBehaviorChange(event, newValue) {
		console.log(`changing behavior of ${event.id} to ${newValue}`);
		var eventsCopy = this.state.events;
		for (var i = 0; i < eventsCopy.length; i++) {
			if (eventsCopy[i].id === event.id) {
				eventsCopy[i].behavior = newValue;
			}
		}
		this.setState({events: eventsCopy});
	}
	
	//TODO: rename this to reflect that we are updating an event, not a pool
	//also, PoolsApp should be refactored to be more separated into pools/events
	//data manipulation
	handlePoolChange(event, newValue) {
		console.log(`changing pool of ${event.id} to ${newValue}`);
		var eventsCopy = this.state.events;
		for (var i = 0; i < eventsCopy.length; i++) {
			if (eventsCopy[i].id === event.id) {
				//this resets the pools so only one can be connected,
				//once multiple pool connetion is implemented,
				//refactor this to make more sense
				eventsCopy[i].connectedPools = []; 
				eventsCopy[i].connectedPools.push(newValue); //should pools be added by symbol (like this), or ID?
			}
		}
		this.setState({events: eventsCopy});
		this.connectPool(newValue, event);
	}

	componentDidMount() {
		ipc.send('run-script');
		this.interval = setInterval(
			(() => {
				//ipc.send('get-indices', 1)
				//ipc.send('get-volts', 1);
			}), 10
		);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		return (
			<div className="pools-app">
				<EventsContainer 
					events={this.state.events} 
					pools={this.state.pools} 
					addEvent={this.addEvent.bind(this)} 
					removeEvent={this.removeEvent.bind(this)} 
					handleBehaviorChange={this.handleBehaviorChange.bind(this)}
					handlePoolChange={this.handlePoolChange.bind(this)}
				/>
				<PoolsContainer pools={this.state.pools}/>
				<InfoPanelsContainer/>
			</div>
		);
	}
}

export default PoolsApp;
