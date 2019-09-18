import React, { Component } from 'react';
import './InfoPanel.css';
import TransportControls from '../TransportControls/TransportControls.js'
import BpmEditor from '../BpmEditor/BpmEditor.js';

class InfoPanel extends Component {
	constructor(props) {
		super(props);
		this.state = {
		
		};
	}

	render() {
		return (
			<div className="info-panel">
				<TransportControls
					startAsl={this.props.startAsl.bind(this)}	
				/>
				<BpmEditor
					bpm={this.props.bpm}
					handleBpmChange={this.props.handleBpmChange.bind(this)}
				/>
			</div>
		);
	}
}

export default InfoPanel;

