import React, { Component } from 'react';
import './InfoPanel.css';

import BpmEditor from '../BpmEditor/BpmEditor.js';

class InfoPanel extends Component {
	constructor(props) {
		super(props);
		this.state = {
		
		};
	}

	render() {
		return (
			<div className="InfoPanel">
				<BpmEditor
					bpm={this.props.bpm}
					handleBpmChange={this.props.handleBpmChange.bind(this)}
				/>
			</div>
		);
	}
}

export default InfoPanel;

