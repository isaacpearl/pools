import React, { Component } from 'react';
import './PoolsContainer.css';
import Pool from '../Pool/Pool.js';

class PoolsContainer extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="pools-container">
				Pools:
				{this.props.pools.map(
					pool => <Pool key={pool.id} size={pool.size} symbol={pool.symbol}/>
				)}
			</div>
		);
	}
}

export default PoolsContainer;

