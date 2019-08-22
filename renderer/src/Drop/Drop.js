import React, { Component } from 'react';
import './Drop.css';

class Drop extends Component {
	constructor(props) {
		super(props);
		this.state = { 
			value: this.props.value,
			active: this.props.active,
			type: this.props.type
		};
	}

	handleChange(event) {
		switch(event.target.className) {
			default:
				break;
			case 'note':
				const re = /^[0-9\b]{0,2}$/; //match up to two integers
				if (event.target.value === '' || re.test(event.target.value)) {
					//this.setState({value: event.target.value});
					//this.props.handleValueChange(this.props.index, event.target.value)
					this.props.handleValueChange(this.props.poolId, this.props.index, event.target.value);
				}
		}
	}
	render() {
		return (
			<span className={"drop" + (this.props.active ? " active" : " inactive")}>
			<input className={this.props.type} type="text" value={this.props.value} onInput={this.handleChange.bind(this)}/>
			</span>
		)
	}
}

export default Drop;

