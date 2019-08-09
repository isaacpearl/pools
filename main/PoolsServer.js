const Crow = require("./src/Crow.js");
const State = require("./src/StateInterface.js");

const {app, BrowserWindow} = require('electron');
const fs = require("fs");
const ipcMain = require('electron').ipcMain;
const SerialPort = require('./node_modules/serialport');
const Readline = require('./node_modules/@serialport/parser-readline');

const crowPort = connectCrow();
const lineStream = crowPort.pipe(new Readline({ delimiter: '\r' }));

lineStream.on('data', function(data) {
	getFullMessage(data);
});

//TODO: double check with Trent that this does anything
function getFullMessage(data) {
	if (data.length === 0) {
		return;
	}
	var split = data.indexOf('\n');
	var now = data.substring(0, split);
	if (now.indexOf("^%^%^")) {
		parseCrowData(now);
	} else {
		console.log(now);
	}
	if (!split) {
		console.log("not split");
		getFullMessage(data.substring(0, split+1));
	}
}

function getCrowMessageArgs(data) {
	newString = data.replace(/[()]/g, '');
	args = newString.split(',');
	return args;
}

function parseCrowData(data) {
	//volt message is  ^^stream(1,1.0000) channel, volts
	//input[x].mode('stream', 0.5) stream mode, and time in seconds to send volt message
	//mode('none') turns off listening
	var splitData = data.split('('); //first element is header, second is args
	switch(splitData[0]) {
		case "^^i":
			var args = getCrowMessageArgs(splitData[1]);
			var eventId = args[0];
			var index = args[1];
			console.log(`event ${eventId} index: ${index}`);
			break;
		default:
			console.log(data);
			break;
	}
}

function getStateScript(filename){
	console.log(`loading ${filename}`);
	var script = fs.readFileSync(filename, "utf8");
	return script;
}

function connectCrow() {
	console.log("CONNECTING TO CROW");
	try {
		crow = new SerialPort('/dev/ttyACM0', {
			baudRate: 115200,
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

ipcMain.on('get-volts', (event, arg) => {
	Crow.getVolts(crowPort, arg);
});

ipcMain.on('run-script', (event, arg) => {
	//Crow.run(crowPort, getStateScript('./src/State/PoolLib.lua'));
	Crow.run(crowPort, getStateScript('./src/State/DropLib.lua'));
	Crow.run(crowPort, getStateScript('./src/State/State.lua'));
});

ipcMain.on('get-indices', (event, arg) => {
	Crow.run(crowPort, `print(events[1].i)`);
});

ipcMain.on('test-print', (event, arg) => {
	Crow.run(crowPort, `print('${arg}')`);
});

//quit and disconnect from Crow when all windows are closed
app.on('window-all-closed', function () {
	//we quit application on window close, unless running on macOS
	if (process.platform !== 'darwin') {
		Crow.close(crowPort);
		app.quit();
	}
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


