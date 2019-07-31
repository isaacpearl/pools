import React, { Component } from 'react';
import './InfoPanelsContainer.css';

const electron = window.require('electron');
//const fs = electron.remote.require('fs');
const ipc  = electron.ipcRenderer;

class InfoPanelsContainer extends Component {
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
			<div className="InfoPanelsContainer">
				info panels container 	
			</div>
		);
	}
}

export default InfoPanelsContainer;

