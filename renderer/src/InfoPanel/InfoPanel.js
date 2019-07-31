import React, { Component } from 'react';
import './InfoPanel.css';

const electron = window.require('electron');
//const fs = electron.remote.require('fs');
const ipc  = electron.ipcRenderer;

class InfoPanel extends Component {
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
			<div className="InfoPanel">
				info panel 	
			</div>
		);
	}
}

export default InfoPanel;

