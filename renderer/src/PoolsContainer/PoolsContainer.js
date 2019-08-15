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
							createDrops={this.props.createDrops.bind(this)}
						/>
					}
				)}
			</div>
		);
	}
}

export default PoolsContainer;

