import React, { Component } from 'react';
import './Event.css';

const electron = window.require('electron');
//const fs = electron.remote.require('fs');
const ipc  = electron.ipcRenderer;

class Event extends Component {
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
			<div className="Event">
				event 	
			</div>
		);
	}
}

export default Event;

