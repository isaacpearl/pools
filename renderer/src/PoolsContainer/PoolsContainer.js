import React, { Component } from 'react';
import './PoolsContainer.css';
import Pool from '../Pool/Pool.js';

class PoolsContainer extends Component {
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
			<div className="pools-container">
				<Pool/> 	
			</div>
		);
	}
}

export default PoolsContainer;

