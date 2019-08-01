import React, { Component } from 'react';
import './PoolsContainer.css';
import Pool from '../Pool/Pool.js';

class PoolsContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pools: this.props.pools,	
		};
	}
	componentDidMount() {

	}

	componentWillUnmount() {

	}

	addPool() {
	
	}

	removePool() {

	}

	render() {
		return (
			<div className="pools-container">
				Pools:
				{this.state.pools.map(
					pool => <Pool size={pool.size} symbol={pool.symbol}/>
				)}
			</div>
		);
	}
}

export default PoolsContainer;

