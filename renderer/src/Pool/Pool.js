import React, { Component } from 'react';
import './Pool.css';

const electron = window.require('electron');
//const fs = electron.remote.require('fs');
const ipc  = electron.ipcRenderer;

class Pool extends Component {
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
			<div className="Pool">
				pool 	
			</div>
		);
	}
}

export default Pool;

