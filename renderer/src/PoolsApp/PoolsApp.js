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
			connectedPools: {},
			terminatesBlock: false,
			index: 1,
		};
		this.setState(prevState => {
			prevState.events.push(event);
			return prevState.events;
		});	
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
		this.setState(
			//update pool state
		);
		this.setState(

		)
	}

	componentDidMount() {
		ipc.send('run-script');
		//ipc.send('get-indices', 1)
		this.interval = setInterval(
			(() => {
					ipc.send('get-volts', 1);
			}), 1
		);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		return (
			<div className="pools-app">
				<EventsContainer events={this.state.events} pools={this.state.pools} addEvent={this.addEvent.bind(this)} removeEvent={this.removeEvent.bind(this)}/>
				<PoolsContainer pools={this.state.pools}/>
				<InfoPanelsContainer/>
			</div>
		);
	}
}

export default PoolsApp;

