const Crow = require("./src/Crow.js");
const State = require("./src/StateInterface.js");

const {app, BrowserWindow} = require('electron');
const fs = require("fs");
const path = require('path'); const os = require('os');
const ipc = require('electron').ipcMain;
const SerialPort = require('./node_modules/serialport');
const Readline = require('./node_modules/@serialport/parser-readline');
const crowPort = connectCrow(); const lineStream = crowPort.pipe(new Readline({ delimiter: '\r' })); lineStream.on('data', function(data) {
	getFullMessage(data);
});
let mainWindow;

function createWindow () {
	mainWindow = new BrowserWindow({
    	width: 1200,
    	height: 800,
    	webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true
    	}
	});
	
	if (process.env.NODE_ENV === 'dev') {
		mainWindow.loadURL('http://localhost:3000');
		mainWindow.webContents.openDevTools();
	} else {
		mainWindow.loadURL(`file://${process.resourcesPath}/build/html/index.html`);
	};
	
 	//dereference window object when the window is closed
 	mainWindow.on('closed', function () {
		mainWindow = null;
	});
	BrowserWindow.addDevToolsExtension(path.join(os.homedir(), '/.config/google-chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/3.6.0_0'));
}

//TODO: double check with Trent that this does anything
function getFullMessage(data) {
	if (data.length === 0) {
		return;
	}
	var split = data.indexOf('\n');
	var now = data.substring(0, split);
	if (now.indexOf("^%^%^")) {
		console.log(now);
		//parseCrowData(now);
	} else {
		console.log(now);
	}
	if (!split) {
		console.log("not split");
		getFullMessage(data.substring(0, split+1));
	}
}

function getCrowMessageArgs(data) {
	var newString = data.replace(/[()]/g, '');
	var args = newString.split(',');
	return args;
}

function parseCrowData(data) {
	//volt message is  ^^stream(1,1.0000) channel, volts
	//input[x].mode('stream', 0.5) stream mode, and time in seconds to send volt message
	//mode('none') turns off listening
	console.log(`debug data: ${data}`);
	var splitData = data.split('('); //first element is header, second is args
	var args = getCrowMessageArgs(splitData[1]);
	switch(splitData[0]) {
		case "^^i":
			mainWindow.webContents.send('new-index', args);
			break;
		case "^^stream":
			mainWindow.webContents.send('update-volts', args);
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

//create window after init
app.on('ready', createWindow);

//create window when activated if no window is present
app.on('activate', function () {
	if (mainWindow === null) createWindow();
});

//quit and disconnect from Crow when all windows are closed
app.on('window-all-closed', function () {
	//we quit application on window close, unless running on macOS
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
 
app.on('quit', function() {
	console.log("quitting and closing crowPort");
	Crow.close(crowPort);
});

crowPort.on('close', function (){
	console.log('CROW PORT CLOSED');
	reconnectCrow();
});

crowPort.on('error', function (err) {
	console.error("error", err);
	reconnectCrow();
});

ipc.on('get-volts', (event, arg) => {
	Crow.getVolts(crowPort, arg);
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
ipc.on('run-script', async (event, arg) => {
	Crow.run(crowPort, getStateScript('./src/State/Globals.lua'));
	await sleep(100);
	Crow.run(crowPort, getStateScript('./src/State/EventLib.lua'));
	await sleep(100);
	Crow.run(crowPort, getStateScript('./src/State/DropLib.lua'));
	await sleep(100);
	Crow.run(crowPort, getStateScript('./src/State/PoolLib.lua'));
	await sleep(100);
	Crow.run(crowPort, getStateScript('./src/State/State.lua'));
	await sleep(100);
	mainWindow.webContents.send('init');
});

ipc.on('get-indices', (event, arg) => {
	Crow.run(crowPort, `print(events[1].i)`);
});

ipc.on('test-print', (event, arg) => {
	Crow.run(crowPort, `print('${arg}')`);
});

ipc.on('connect-pool', (event, arg) => {
	State.connectPool(crowPort, arg[0], arg[1]);
});

ipc.on('add-pool', (event, arg) => {
	State.addPool(crowPort, arg[0], arg[1]);
});

ipc.on('add-event', (event, arg) => {
	State.addEvent(crowPort, arg[0], arg[1], arg[2], arg[3]);
});

ipc.on('start-asl', (event, arg) => {
	State.setChannelASL(crowPort, arg);
});

ipc.on('drop-value-change', (event, arg) => {
	State.changeDropValue(crowPort, arg[0], arg[1], arg[2]);
});

ipc.on('set-behavior', (event, arg) => {
	State.setBehavior(crowPort, arg[0], arg[1]);
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


