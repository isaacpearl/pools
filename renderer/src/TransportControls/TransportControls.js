import React, { Component } from 'react';
import './TransportControls.css';

class TransportControls extends Component {
	constructor(props) {
		super(props);
		this.state = {
		
		};
	}

	render() {
		return (
			<div className="transport-controls">
				<button onClick={this.props.startAsl()}>start ASL</button>
			</div>
		);
	}
}

export default TransportControls;

