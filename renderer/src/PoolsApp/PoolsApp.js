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
			poolSymbols: {}
		};
	}

	addEvent(eventFunc) {
		var event = {
			id : uniqid(),
			func: eventFunc,
			args: this.getArgs(eventFunc),
			behavior: "step",
			connectedPools: [], 
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
	
	removeEvent(event) {
		ipc.send('remove-event', event);
		var newEvents = this.state.events;
		delete newEvents[event.id];
		this.setState({events: newEvents});
	}
	
	getArgs(func) {
		var defaultArgParams = {
			color: "",
			pool: "",
			index: 1,
			value: 1
		};
		var args = {};
		switch(func) {
  			case 'to':
				args = {
					destination: defaultArgParams, 
					time: defaultArgParams
				};
				break;
			case 'note':
				args = {
					destination: defaultArgParams,
					time: defaultArgParams
				};
				break;
			default:
				break;
		}
		return args;
	}
	
	connectPool(pool, event) {
		var poolsCopy = this.state.pools;
		//TODO: refactor this to use object assignment directly instead of iterating over everything?
		for (var i = 0; i < Object.keys(poolsCopy).length; i++) {
			var thisPool = poolsCopy[Object.keys(poolsCopy)[i]];
			if (thisPool.id === pool) {
				thisPool.connected[event.id] = event;
				ipc.send('connect-pool', [event.id, thisPool.id]);
			} 
			else if (thisPool.connected[event.id] === event) {
				delete thisPool.connected[event.id]; // removes event.id property in this pool
			}
		}
		this.setState({pools: poolsCopy});
	}

	disconnectPool(pool, event) {
		var poolsCopy = this.state.pools;

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

	handleBehaviorChange(event, newValue) {
		var eventsCopy = this.state.events;
		if (event.id in eventsCopy) {
			eventsCopy[event.id].behavior = newValue;
			ipc.send('set-behavior', [event.id, newValue]);
			this.setState({events: eventsCopy});
		}
	}
	
	handlePoolChange(event, newValue) {
		console.log(`changing pool of ${event.id} to ${newValue}`);
		var eventsCopy = this.state.events;
		eventsCopy[event.id].connectedPools = []; 
		eventsCopy[event.id].connectedPools.push(newValue); //should pools be added by symbol (like this), or ID?
		this.setState({events: eventsCopy});
		this.connectPool(newValue, event);
	}

	handleIndexChange(event, args) {
		var poolsCopy = this.state.pools;
		var eventId = args[0];
		var index = args[1] - 1;
		var poolId = this.state.events[eventId].connectedPools[0];
		//these calls should use this.setState()
		this.state.drops[poolId][(index-1).mod(this.state.poolLength)].active = false;
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
		//ipc.send('run-script');
		ipc.send('upload-script');
		ipc.on('init', () => {
			this.addPool('X', this.state.poolLength);
			this.addPool('O', this.state.poolLength);
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
					poolSymbols={this.state.poolSymbols}
					addEvent={this.addEvent.bind(this)} 
					removeEvent={this.removeEvent.bind(this)} 
					handleBehaviorChange={this.handleBehaviorChange.bind(this)}
					handlePoolChange={this.handlePoolChange.bind(this)}
				/>
				<PoolsContainer 
					pools={this.state.pools}	
					drops={this.state.drops}
					handleDropValueChange={this.handleDropValueChange.bind(this)}
					ipc={ipc}
				/>
				<InfoPanelsContainer/>
			</div>
		);
	}
}

export default PoolsApp;
