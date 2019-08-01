import React, { Component } from 'react';
import './Drop.css';

class Drop extends Component {
	constructor(props) {
		super(props);
		console.log(`drop val: ${this.props.value}`)
		this.state = {
			value: this.props.value,
		};
	}
	componentDidMount() {

	}

	componentWillUnmount() {

	}

	render() {
		return (
			<span className="drop">
				{this.state.value}	
			</span>
		);
	}
}

export default Drop;

