import React, { Component } from 'react';

import './PoolsApp.css';
import PoolsContainer from '../PoolsContainer/PoolsContainer.js';
import EventsContainer from '../EventsContainer/EventsContainer.js';
import InfoPanelsContainer from '../InfoPanelsContainer/InfoPanelsContainer.js';

const electron = window.require('electron');
//const fs = electron.remote.require('fs');
const ipc  = electron.ipcRenderer;

class PoolsApp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			testEvents: [
				{func: 'to'},
				{func: 'to'}
			],
			testPools: [
				{size: 8, symbol: 'X'},
				{size: 8, symbol: 'O'}
			]
		};
	}

	componentDidMount() {
		ipc.send('run-script');
		//ipc.send('get-indices', 1)
		this.interval = setInterval(
			(() => 
				ipc.send('get-volts', 1)
			), 1
		);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		return (
			<div className="pools-app">
				<EventsContainer events={this.state.testEvents}/>
				<PoolsContainer pools={this.state.testPools}/>
				<InfoPanelsContainer/>
			</div>
		);
	}
}

export default PoolsApp;

