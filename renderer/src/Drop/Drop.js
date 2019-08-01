import React, { Component } from 'react';
import './Drop.css';

class Drop extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: 0,
			active: false,
			type: 'note'
		};
	}

	componentDidMount() {

	}

	componentWillUnmount() {

	}

	handleChange(event) {
		switch(event.target.className) {
			default:
				break;
			case 'note':
				const re = /^[0-9\b]{0,2}$/; //match up to two integers
				if (event.target.value === '' || re.test(event.target.value)) {
					this.setState({value: event.target.value});
				}
		}
	}

	render() {
		return (
			<span className={"drop" + (this.state.active ? " active" : " inactive")}>
			<input className={this.state.type} type="text" value={this.state.value} onInput={this.handleChange.bind(this)}/>
			</span>
		);
	}
}

export default Drop;
