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
			case 'arg pools':
				var menuInput = newValue.split(',');
				var arg = menuInput[0];
				var newPoolId = menuInput[1];
				this.props.handlePoolChange(newPoolId, this.props.id, arg);
				break;
			case 'arg behavior':
				var menuInput = newValue.split(',');
				var arg = menuInput[0];
				var b = menuInput[1];
				this.props.handleBehaviorChange(b, arg);
				break;
		}
	}

	argMenus(arg) {
		return ( 
			<span>
				&nbsp;{arg}= 
				<select className="arg behavior" onChange={this.handleChange.bind(this)}>
					{this.props.behaviors.map(
						(behavior, index) => {
							return <option key={index} value={[arg, behavior]}>{behavior}</option>
						} 
					)}	
				</select> 
				<select className="arg pools" onChange={this.handleChange.bind(this)}>
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
				<span className="args">({Object.keys(this.props.args).map((arg, index) => (this.argMenus(arg)))} )
				</span> 	
				<button className="remove-event" onClick={this.props.removal}>-</button>	
			</div>
		);
	}
}

export default Event;

