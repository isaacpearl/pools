import React, { Component } from 'react';
import './InfoPanelsContainer.css';
import InfoPanel from '../InfoPanel/InfoPanel.js';

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
			<div className="info-panels-container">
				<InfoPanel/>
			</div>
		);
	}
}

export default InfoPanelsContainer;

