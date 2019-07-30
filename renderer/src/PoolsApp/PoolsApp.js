import React, { Component } from 'react';
//import logo from './logo.svg';
import './PoolsApp.css';

const electron = window.require('electron');
const fs = electron.remote.require('fs');
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
			<div className="PoolsApp">
				pools app!!!
			</div>
		);
	}
}

export default PoolsApp;

