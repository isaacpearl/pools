import React, { Component } from 'react';
import './PoolsApp.css'; 
import PoolsContainer from '../PoolsContainer/PoolsContainer.js'; 
import EventsContainer from '../EventsContainer/EventsContainer.js'; 
import InfoPanelsContainer from '../InfoPanelsContainer/InfoPanelsContainer.js';

import uniqid from 'uniqid';

const electron = window.require('electron'); 
//const fs = electron.remote.require('fs'); 
const ipc  = electron.ipcRenderer;

//implementation of modulo for index wraparound 
Number.prototype.mod = function(n) {
	return ((this%n)+n)%n;
}

class PoolsApp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			events: {},
			pools: {},
			drops: {},
			poolLength: 8,
			poolSymbols: {},
			behaviors: ["step", "rand"]
		};
	}

	addEvent(eventFunc) {
		console.log("adding eventFunc of: ", eventFunc);
		var event = {
			id : uniqid(),
			func: eventFunc,
			args: this.getArgs(eventFunc),
			behavior: "step",
			terminatesBlock: false, 
			index: -1, 
			color: ''
		};
		var prevEvents = this.state.events;
		prevEvents[event.id] = event;
		prevEvents[event.id].index = Object.keys(prevEvents).length;
		this.setState({events: prevEvents});
		ipc.send('add-event', [event.id, event.func, event.args, event.behavior, event.index]);
		console.log(`added event ${event.id}`);
	}
	
	addPool(poolSymbol, poolSize) {
		var poolsCopy = this.state.pools;
		var poolSymbolsCopy = this.state.poolSymbols
		var poolToAdd = {
			id: uniqid(), 
			size: poolSize, 
			symbol: poolSymbol, 
			connected: {}
		}
		poolsCopy[poolToAdd.id] = poolToAdd;
		poolSymbolsCopy[poolSymbol] = poolToAdd.id;
		this.createDrops(poolToAdd.id, this.state.poolLength);
		this.setState({pools: poolsCopy, poolSymbols: poolSymbolsCopy});
		ipc.send('add-pool', [poolToAdd.id, new Array(poolSize).fill(0)]);
	}
	
	createDrops(parentId, size) {
		var drops = []
		for (var i = 0; i < size; i++) {
			var drop = {
				id: uniqid(),
				poolId: parentId,
				index: (i+1), //lua is 1-indexed
				value: 0,
				active: false,
				type: 'note'
			}
			drops.push(drop);
		}
		var dropCopy = this.state.drops;
		dropCopy[parentId] = drops;
		this.setState({drops: dropCopy});
	}
	
	connectPool(poolId, eventId, argument) {
		console.log(`connecting pool ${poolId} to ${argument} of event ${eventId}`);
		var poolsCopy = this.state.pools;
		var eventsCopy = this.state.events;
		eventsCopy[eventId].args[argument].pool = poolId;
		//poolsCopy[poolId].connected[eventId] = eventsCopy[eventId];
		ipc.send('connect-pool', [eventId, poolId, argument]);
		this.setState({pools: poolsCopy, events: eventsCopy});
	}

	//UNUSED, DELETE ONCE WE DECIDE TO NOT DO THIS
	disconnectPool(pool, event) {
		var poolsCopy = this.state.pools;
		var eventsCopy = this.state.events;
	}

	removeEvent(event) {
		ipc.send('remove-event', event);
		var newEvents = this.state.events;
		delete newEvents[event.id];
		this.setState({events: newEvents});
	}

	defaultArgParams(arg) {
		return {
			name: arg,
			color: "",
			pool: "",
			index: 1,
			prevIndex: 0,
			value: 1,
			behavior: ""
		}
	}
	getArgs(func) {
		var args = {};
		switch(func) {
  			case 'toward':
				args = {
					destination: this.defaultArgParams("destination"), 
					time: this.defaultArgParams("time")
				};
				break;
			case 'note':
				args = {
					destination: this.defaultArgParams("destination"),
					time: this.defaultArgParams("time")
				};
				break;
			default:
				break;
		}
		return args;
	}

	handleBehaviorChange(event, newValue, argument) {
		var eventsCopy = this.state.events;
		if (event.id in eventsCopy) {
			eventsCopy[event.id].args[argument].behavior = newValue;
			ipc.send('set-behavior', [event.id, newValue, argument]);
			this.setState({events: eventsCopy});
		}
	}

	handleIndexChange(event, args) {
		var poolsCopy = this.state.pools;
		var eventsCopy = this.state.events;
		var eventId = args[0];
		var argument = args[1];
		var index = args[2] - 1;
		var prevIndex = args[3] - 1;
		var poolId = this.state.events[eventId].args[argument].pool;
		console.log(`poolId: ${poolId}, argument: ${argument}`);
		//these calls should use this.setState()
		//this.state.drops[poolId][(index-1).mod(this.state.poolLength)].active = false;
		this.state.drops[poolId][prevIndex].active = false;
		this.state.drops[poolId][index].active = true;
		this.setState({ pools: poolsCopy });
		//for loop
		//this.setState()
		//set event with id === event's index to index
	}

	handleDropValueChange(poolId, dropIndex, newValue) {
		var dropsCopy = this.state.drops;
		var changingDrop = dropsCopy[poolId][dropIndex-1]; //-1 to account for lua 1-indexing
		changingDrop.value = newValue;
		ipc.send('drop-value-change', [poolId, dropIndex, newValue]);
		this.setState({ drops: dropsCopy });
	}

	handleVoltsChange(event, args) {
		//TODO: implement this once events/drops can use input values
		var channel = args[0];
		var volts = args[1];
	}

	startASL(channel) {
		channel = 1; //TODO: make this actually work
		ipc.send('start-asl', channel);
	}

	componentDidMount() {
		//declare all react ipc listeners/senders
		ipc.send('upload-script');
		ipc.on('init', () => {
			this.addPool('X', this.state.poolLength);
			this.addPool('O', this.state.poolLength);
			this.addPool('@', this.state.poolLength);
			this.addPool('#', this.state.poolLength);
		});
		ipc.on('new-index', (eventId, index) => {
			this.handleIndexChange(eventId, index);
		});
		ipc.on('update-volts', (channel, volts) => {
			this.handleVoltsChange(channel, volts);
		}); 
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		return (
			<div className="pools-app">
				<button onClick={this.startASL}>start ASL</button>
				<EventsContainer 
					events={this.state.events} 
					pools={this.state.pools} 
					behaviors={this.state.behaviors}
					poolSymbols={this.state.poolSymbols}
					addEvent={this.addEvent.bind(this)} 
					removeEvent={this.removeEvent.bind(this)} 
					handleBehaviorChange={this.handleBehaviorChange.bind(this)}
					handlePoolChange={this.connectPool.bind(this)}
				/>
				<PoolsContainer 
					pools={this.state.pools}	
					drops={this.state.drops}
					handleDropValueChange={this.handleDropValueChange.bind(this)}
					ipc={ipc}
				/>
			</div>
		);
	}
}

export default PoolsApp;
