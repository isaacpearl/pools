const Crow = require("./src/Crow.js");
const State = require("./src/StateInterface.js");

const fs = require("fs");
const ipcMain = require('electron').ipcMain;
const SerialPort = require('./node_modules/serialport');
const Readline = require('./node_modules/@serialport/parser-readline');

const crowPort = connectCrow();
const lineStream = crowPort.pipe(new Readline());

lineStream.on('data', function(data) {
	//check out crowmax.lua in /max for example, eval line 29 
	//build up string of data, detect end of message by looking for \r, then pass to parseCrowData
	/* example from crowmax.lua:
	function eval( str )
		if #str == 0 then return end
		local split = string.find( str, "\r" )
		local now = str:sub( 1, split)
		if string.find( now, "^%^%^") then
			pcall( loadstring( now:sub(3)))
		else
			to_max_print( now )
		end
		if split ~= nil then --in case of dropped \r
			eval( str:sub( split+1))
		end
	end
	*/
	parseCrowData(data);
});

function parseCrowData(data) {
	switch(data) {
		default:
			console.log(data);
			break;
	}
};

function getStateScript(){
	var script = fs.readFileSync("src/StateTest.lua", "utf8");
	//console.log(script);
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
	Crow.run(crowPort, getStateScript());
});

ipcMain.on('get-indices', (event, arg) => {
	Crow.run(crowPort, `print(events[1].i)`);
});

ipcMain.on('test-print', (event, arg) => {
	Crow.run(crowPort, `print('${arg}')`);
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


