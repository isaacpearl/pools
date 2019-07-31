import React, { Component } from 'react';
import './PoolsContainer.css';

const electron = window.require('electron');
//const fs = electron.remote.require('fs');
const ipc  = electron.ipcRenderer;

class PoolsContainer extends Component {
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
			<div className="PoolsContainer">
				pools container 	
			</div>
		);
	}
}

export default PoolsContainer;

