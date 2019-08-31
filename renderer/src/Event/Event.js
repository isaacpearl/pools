import React, { Component } from 'react';
import './Event.css';

//TODO: utilize currently unused color prop

class Event extends Component {

	handleChange(event) {
		console.log("handling change");
		const newValue = event.target.value;
		if (newValue === "") {
			return;
		}
		switch(event.target.className) {
			default:
				break;
			case 'behavior':
				this.props.handleBehaviorChange(newValue);
				break;
			case 'arg-pools':
				console.log(`newValue: ${newValue}`);
				var menuInput = newValue.split(',');
				var arg = menuInput[0];
				var newPoolId = menuInput[1];
				console.log(`newPoolId: ${newPoolId}, this.props.id: ${this.props.id}, arg: ${arg}`);
				this.props.handlePoolChange(newPoolId, this.props.id, arg);
				break;
		}
	}

	argMenus(arg) {
		if (this.props.pools[this.props.args[arg].pool]) {
			console.log(`args stuff: ${this.props.pools[this.props.args[arg].pool].symbol}`)
		}
		return ( 
			<span>
				<br></br>
				{arg}: 
				<select className="arg-pools" value={this.props.pool} onChange={this.handleChange.bind(this)}>
					<option value={""}>select pool</option>
					{Object.keys(this.props.pools).map(
						poolKey => {
							var pool = this.props.pools[poolKey];
							return <option key={pool.id} value={[arg, pool.id]}>{pool.symbol}</option>
						} 
					)}	
				</select>
			</span>	
		)
	}
	
	render() {
		return (
			<div className={`event ${this.props.func} ${this.props.color}`}>
				<p></p>
				<span className="func-name">{this.props.func} </span> 	
				<span className="args">
				(
				{Object.keys(this.props.args).map(arg => (this.argMenus(arg)))}
				<br></br>
				)
				</span> 	
				<p>behavior: </p>
				<select className="behavior" value={this.props.behavior} onChange={this.handleChange.bind(this)}>
					<option value="step">step</option>
					<option value="rand">random</option>
				</select>
				<br></br>
				<button className="remove-event" onClick={this.props.removal}>-</button>	
			</div>
		);
	}
}

export default Event;

