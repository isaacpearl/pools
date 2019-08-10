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
			pools: []
		};
	}

	addEvent() {
		var event = {
			id : uniqid(),
			func: "noteFunc",
			behavior: "step",
			connectedPools: [], terminatesBlock: false, index: 1,
			color: ''
		};
		var prevEvents = this.state.events;
		prevEvents.push(event);
		this.setState({events: prevEvents});
		ipc.send('add-event', [event.id, event.func, event.behavior, event.index]);
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
		var poolsCopy = this.state.pools;
		for (var i = 0; i < poolsCopy.length; i++) {
			if (poolsCopy[i].symbol === pool) {
				poolsCopy[i].connected[event.id] = event;
				ipc.send('connect-pool', [event.id, poolsCopy[i].id]);
			} 
			else if (poolsCopy[i].connected[event.id] === event) {
				delete poolsCopy[i].connected[event.id]; // removes event.id property in this pool
			}
		}
		this.setState({pools: poolsCopy});
	}

	addPool(poolSymbol, poolSize) {
		var poolsCopy = this.state.pools;
		var poolToAdd = {
			id: uniqid(), 
			size: poolSize, 
			symbol: poolSymbol, 
			connected: {}
		};
		poolsCopy.push(poolToAdd)
		this.setState({pools: poolsCopy});
		ipc.send('add-pool', [poolToAdd.id, new Array(poolSize).fill(0)]);
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

	handleIndexChange(event, args) {
		var eventId = args[0];
		var index = args[1];
		console.log(`event: ${eventId}, index: ${index}`);
		//set event with id === event's index to index
	}

	handleVoltsChange(event, args) {
		//TODO: implement this once events/drops can use input values
		var channel = args[0];
		var volts = args[1];
	}

	startASL(channel) {
		channel = 1; //TODO: make this actually work
		ipc.send('start-asl', channel);
	}

	componentDidMount() {
		//declare all react ipc listeners/senders
		ipc.send('run-script');
		ipc.on('init', () => {
			this.addPool('X', 8);
			this.addPool('O', 8);
		});
		ipc.on('new-index', (eventId, index) => {
			this.handleIndexChange(eventId, index);
		});
		ipc.on('update-volts', (channel, volts) => {
			this.handleVoltsChange(channel, volts);
		}); 
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		return (
			<div className="pools-app">
				<button onClick={this.startASL}>start ASL</button>
				<EventsContainer 
					events={this.state.events} 
					pools={this.state.pools} 
					addEvent={this.addEvent.bind(this)} 
					removeEvent={this.removeEvent.bind(this)} 
					handleBehaviorChange={this.handleBehaviorChange.bind(this)}
					handlePoolChange={this.handlePoolChange.bind(this)}
				/>
				<PoolsContainer 
					pools={this.state.pools}	
					ipc={ipc}
				/>
				<InfoPanelsContainer/>
			</div>
		);
	}
}

export default PoolsApp;
