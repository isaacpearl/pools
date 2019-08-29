//StateInterface.js
//This module defines a JavaScript interface to the state manipulation functions in state.lua

const Crow = require("./Crow.js");

//creates the string representation of a 
//lua table from a JavaScript array (will need
//to adapt as 'drop' object becomes more complex)
function getDropsTable(drops) {
	var tableString = '{';
	for (var i = 0; i < drops.length; i++) {
		tableString += ` ${drops[i]}`;
		if (i != drops.length-1) {
			tableString += ","
		} else {
			tableString += ' }';
		}
	}
	return tableString;
}

function objectToTable(o) {
	var tableString = `{`;
	var properties = Object.keys(o);
	for (var i = 0; i < properties.length; i++) {
		var property = properties[i];
		var valueToAdd = "";
		switch(typeof(o[property])) {
			case "object":
				valueToAdd = `${objectToTable(o[property])}`;
				break;
			case "number": 
				valueToAdd = ` ${o[property]}`; 
				break;
			case "string":
				valueToAdd = ` "${o[property]}"`;
				break;
			case "boolean":
				valueToAdd = ` ${o[property]}`;
				break;
			default:
				break;
		}
		tableString += `${property} = ${valueToAdd}`;
		if (i != properties.length-1) {
			tableString += ", "
		} else {
			tableString += ' }';
		}
	}
	//console.log(tableString);
	return tableString;
}

const addPool = (crowPort, poolId, drops) => {
	Crow.run(crowPort, `pools = addPool(pools, "${poolId}", ${getDropsTable(drops)})`);
};

const removePool = (crowPort, poolIndex) => {
	Crow.run(crowPort, `removePool(${poolIndex})`);
};

const addEvent = (crowPort, eventId, eventFunction, functionArgs, behavior, index) => {
	Crow.run(crowPort, `events = addEvent(events, "${eventId}", functions.${eventFunction}, ${objectToTable(functionArgs)}, behaviors.${behavior}, ${index})`);
	Crow.run(crowPort, `print("added event ${eventId}: ", events.${eventId})`);
};

const removeEvent = (crowPort, event) => {
	for (var i = 0; i < event.connectedPools.length; i++) {
		var poolToDisconnect = event.connectedPools[i];
		Crow.run(crowPort, `print("pool to disconnect: ", pools.${poolToDisconnect})`);
		Crow.run(crowPort, `pools.${poolToDisconnect} = disconnectEventFromPool(pools.${poolToDisconnect}, events.${event.id})`);
	}
	Crow.run(crowPort, `events = removeEvent("${event.id}")`);
	setChannelASL(crowPort, 1);
};


const connectPool = (crowPort, eventId, poolId, argument) => {
	Crow.run(crowPort, `connectPoolToArgument("${eventId}", "${poolId}", "${argument}")`);
	//Crow.run(crowPort, `connectArgumentToPool("${poolId}", "${eventId}", "${argument}")`);
	//Crow.run(crowPort, `print("event's pool: ", events.${eventId}.pool)`)
};

const disconnectPool = (crowPort, eventIndex, poolIndex) => {
	Crow.run(crowPort, `disconnectPool(events.${eventindex}, pools.${poolIndex}`);
};

const addDrops = (crowPort, poolId, drops) => {
	Crow.run(crowPort, `addDrops(pools.${poolId}, ${getDropsTable(drops)})`);
};

const changeDropValue = (crowPort, poolId, dropIndex, newValue) => {
	Crow.run(crowPort, `changeDropValue(pools.${poolId}, ${dropIndex}, ${newValue})`);
};

const removeDrops = (crowPort, poolIndex, drops) => {
	Crow.run(crowPort, `removeDrops(pools.${poolIndex}, ${getDropsTable(drops)})`);
};

const setChannelASL = (crowPort, outputChannel) => {
	Crow.run(crowPort, `output[${outputChannel}].action = loop { createASL(events) }`);
};

const setBehavior = (crowPort, eventId, newBehavior) => {
	Crow.run(crowPort, `events.${eventId} = setBehavior(events.${eventId}, behaviors.${newBehavior})`);
}

module.exports = {
	addPool,
	removePool,
	addEvent,
	removeEvent,
	connectPool,
	disconnectPool,
	addDrops,
	removeDrops,
	setChannelASL,
	changeDropValue,
	setBehavior
};

