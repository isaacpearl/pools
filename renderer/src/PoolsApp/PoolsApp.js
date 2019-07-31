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
		
		};
	}

	componentDidMount() {
		this.interval = setInterval(
			(() => 
				ipc.send('run-script', 1) 
			), 1000
		);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		return (
			<div>
				pools
				<div className="pools-app">
					<EventsContainer/>
					<PoolsContainer/>
					<InfoPanelsContainer/>
				</div>
			</div>
		);
	}
}

export default PoolsApp;

