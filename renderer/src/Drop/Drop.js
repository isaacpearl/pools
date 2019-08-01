import React, { Component } from 'react';
import './Drop.css';

class Drop extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: 0,
			active: false,
			type: 'int'
		};
	}

	componentDidMount() {

	}

	componentWillUnmount() {

	}

	handleChange(event) {
		console.log(event.target.className);
		const newValue = (event.target.validity.valid) ? event.target.value : this.state.value;
		this.setState({value: newValue})

	}

	render() {
		return (
			<span className={"drop" + (this.state.active ? " active" : " inactive")}>
					
			<input className={this.state.type}type="text" pattern="[0-9]" onInput={this.handleChange.bind(this)}/>
			</span>
		);
	}
}

export default Drop;

