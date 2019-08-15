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

const addPool = (crowPort, poolId, drops) => {
	Crow.run(crowPort, `pools = addPool(pools, "${poolId}", ${getDropsTable(drops)})`);
};

const removePool = (crowPort, poolIndex) => {
	Crow.run(crowPort, `removePool(${poolIndex})`);
};

const addEvent = (crowPort, eventId, eventFunction, behavior, index) => {
	Crow.run(crowPort, `events = addEvent(events, "${eventId}", functions.${eventFunction}, behaviors.${behavior}, ${index})`);
};

const removeEvent = (crowPort, eventIndex) => {
	Crow.run(crowPort, `removeEvent(${eventIndex})`);
};

const connectPool = (crowPort, eventId, poolId) => {
	Crow.run(crowPort, `connectPoolToEvent(events.${eventId}, pools.${poolId})`);
	Crow.run(crowPort, `connectEventToPool(pools.${poolId}, events.${eventId})`);
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

