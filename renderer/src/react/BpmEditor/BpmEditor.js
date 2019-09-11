import React, { Component } from 'react';
import './BpmEditor.css';


class BpmEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {
		
		};
	}

	handleChange(event) {
		var newBpm = event.target.value;
		if (newBpm < 1) {
			newBpm = 1;
		} else if (newBpm > 300) {
			newBpm = 300;
		}
		this.props.handleBpmChange(newBpm);
	}

	render() {
		return (
			<div className="BpmEditor">
				BPM:
				<input className="bpm-input" type="number" value={this.props.bpm} onInput={this.handleChange.bind(this)}/>
			</div>
		);
	}
}

export default BpmEditor;

