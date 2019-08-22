import React, { Component } from 'react';
import './PoolsContainer.css';
import Pool from '../Pool/Pool.js';

class PoolsContainer extends Component {
	render() {
		return (
			<div className="pools-container">
				Pools:
				{Object.keys(this.props.pools).map(
					poolKey => {
						var pool = this.props.pools[poolKey]
						return <Pool 
							key={pool.id} 
							id={pool.id} 
							size={pool.size} 
							symbol={pool.symbol}
							handleDropValueChange={this.props.handleDropValueChange.bind(this)}
							drops={this.props.drops[pool.id]}
						/>
					}
				)}
			</div>
		);
	}
}

export default PoolsContainer;

