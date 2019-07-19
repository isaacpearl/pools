const Crow = require("./src/Crow.js");
const Drop = require("./src/Drop.js");
const Event = require("./src/Event.js");
const Pool = require("./src/Pool.js");

const SerialPort = require('./node_modules/serialport');
const Readline = require('./node_modules/@serialport/parser-readline');
const crowPort = new SerialPort('/dev/ttyACM0', {
	baudRate: 115200 
})

const fs = require("fs");

function getStateScript(){
	return fs.readFileSync("src/state.lua", "utf8");
}

Crow.run(crowPort, getStateScript());
