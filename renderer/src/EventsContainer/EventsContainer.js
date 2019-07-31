import React, { Component } from 'react';
import './EventsContainer.css';

const electron = window.require('electron');
//const fs = electron.remote.require('fs');
const ipc  = electron.ipcRenderer;

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
			<div className="EventsContainer">
				events container 	
			</div>
		);
	}
}

export default EventsContainer;

