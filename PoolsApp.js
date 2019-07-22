const Crow = require("./src/Crow.js");
const Drop = require("./src/Drop.js");
const Event = require("./src/Event.js");
const Pool = require("./src/Pool.js");

const fs = require("fs");
const ipcMain = require('electron').ipcMain;
const SerialPort = require('./node_modules/serialport');
const Readline = require('./node_modules/@serialport/parser-readline');
const crowPort = connectCrow();

function getStateScript(){
	var script = fs.readFileSync("src/state.lua", "utf8");
	console.log(script);
	return script;
}

function connectCrow() {
	try {
		crow = new SerialPort('/dev/ttyACM0', {
			baudRate: 115200 
		});
	} catch (err) {
		console.log(`error on connection: ${err.message}`);
		reconnectCrow();
	}
	
	return crow;
}

// check for connection errors or drops and reconnect (currently not working)
var reconnectCrow = function () {
  console.log('INITIATING RECONNECT');
  setTimeout(function(){
    console.log('RECONNECTING TO CROW');
    connectCrow();
  }, 2000);
};

crowPort.on('close', function (){
	console.log('CROW PORT CLOSED');
	reconnectCrow();
});

crowPort.on('error', function (err) {
	console.error("error", err);
	reconnectCrow();
});

ipcMain.on('run-script', (event, arg) => {
	Crow.getVolts(crowPort, 1);
	//Crow.run(crowPort, getStateScript());
});

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


