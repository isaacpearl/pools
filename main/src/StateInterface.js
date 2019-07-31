//StateInterface.js
//This module defines a JavaScript interface to the state manipulation functions in state.lua

const Crow = require("./Crow.js");

//creates the string representation of a 
//lua table from a JavaScript array (will need
//to adapt as 'drop' object becomes more complex)
function getDropsTable(drops) {
	var tableString = '{';
	for (var i = 0; i < drops.length; i++) {
		tableString += ` ${drops[i]},`;
	}
	tableString += ' }';
	return tableString;
}

const createPool = (crowPort, drops) => {
	Crow.run(crowPort, `table.insert(pools, createPool(${getDropsTable(drops)}))`);
};

const removePool = (crowPort, poolIndex) => {
	Crow.run(crowPort, `removePool(${poolIndex})`);
};

const createEvent = (crowPort, func, behavior) => {
	Crow.run(crowPort, `table.insert(events, createEvent(functions.${func}, behaviors.${behavior}))`);
};

const removeEvent = (crowPort, eventIndex) => {
	Crow.run(crowPort, `removeEvent(${eventIndex})`);
};

const connectPool = (crowPort, eventIndex, poolIndex) => {
	Crow.run(crowPort, `connectPool(events[${eventIndex}], pools[${poolIndex}])`);
};

const disconnectPool = (crowPort, eventIndex, poolIndex) => {
	Crow.run(crowPort, `disconnectPool(events[${eventindex}], pools[${poolIndex}]`);
};

const addDrops = (crowPort, poolIndex, drops) => {
	Crow.run(crowPort, `addDrops(pools[${poolIndex}], ${getDropsTable(drops)})`);
};

const removeDrops = (crowPort, poolIndex, drops) => {
	Crow.run(crowPort, `removeDrops(pools[${poolIndex}], ${getDropsTable(drops)})`);
};


module.exports = {
	createPool,
	removePool,
	createEvent,
	removeEvent,
	connectPool,
	disconnectPool,
	addDrops,
	removeDrops,
};

