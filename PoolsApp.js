const Crow = require("./src/Crow.js");
const Drop = require("./src/Drop.js");
const Event = require("./src/Event.js");
const Pool = require("./src/Pool.js");

const fs = require("fs");
const ipcMain = require('electron').ipcMain;
const SerialPort = require('./node_modules/serialport');
const Readline = require('./node_modules/@serialport/parser-readline');
const crowPort = new SerialPort('/dev/ttyACM0', {
	baudRate: 115200 
})

function getStateScript(){
	var script = fs.readFileSync("src/state.lua", "utf8");
	console.log(script);
	return script;
}

/*
IPC USAGE:

ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.reply('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.returnValue = 'pong'
})
*/

ipcMain.on('run-script', (event, arg) => {
	Crow.run(crowPort, getStateScript());
});
