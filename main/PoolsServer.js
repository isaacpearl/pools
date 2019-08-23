const Crow = require("./src/Crow.js");
const State = require("./src/StateInterface.js");

const {app, BrowserWindow} = require('electron');
const fs = require("fs");
const path = require('path'); const os = require('os');
const ipc = require('electron').ipcMain;
const SerialPort = require('./node_modules/serialport'); const Readline = require('./node_modules/@serialport/parser-readline'); const crowPort = connectCrow(); const lineStream = crowPort.pipe(new Readline({ delimiter: '\r' })); lineStream.on('data', function(data) {
	getFullMessage(data);
});

let mainWindow;
var hasPools = false;
var poolsIsLoaded = false;

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
	
	//load react developer tools
	//TODO: store this extension in the project so local user updates
	//don't invalidate this filepath
	BrowserWindow.addDevToolsExtension(path.join(os.homedir(), '/.config/google-chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.0.5_0'));
}

function getFullMessage(data) {
	if (data.length === 0) {
		return;
	}
	var split = data.indexOf('\n');
	var now = data.substring(0, split);
	if (now.indexOf("^^") != -1) {
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
	var newString = data.replace(/[()]/g, '');
	var args = newString.split(',');
	return args;
}

function parseCrowData(data) {
	//volt message is  ^^stream(1,1.0000) channel, volts
	//input[x].mode('stream', 0.5) stream mode, and time in seconds to send volt message
	//mode('none') turns off listening
	var splitData = data.split('('); //first element is header, second is args
	var args = getCrowMessageArgs(splitData[1]);
	switch(splitData[0]) {
		case "^^i":
			mainWindow.webContents.send('new-index', args);
			break;
		case "^^stream":
			mainWindow.webContents.send('update-volts', args);
			break;
		case "^^pools":
			hasPools = true;
			break;
		case "^^reset_state":
			console.log(`resetting state`);
			mainWindow.webContents.send('init');
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

ipc.on('upload-script', async (event, arg) => {
	console.log(`Checking for Pools state script on Crow...`)
	Crow.run(crowPort, `hasPools()`);
	await sleep(100);
	if (!hasPools) {
		console.log(`Pools state script not found, attempting to upload`)
		stateScripts = {};
		var stateFiles = fs.readdirSync('./src/State/');
		for (var i = 0; i < stateFiles.length; i++) {
			var filePath = `./src/State/${stateFiles[i]}`;
			if (filePath.substr(filePath.length-4) === ".lua") {
				stateScripts[stateFiles[i]] = getStateScript(filePath);
			}
		}
		Crow.uploadMultiple(crowPort, stateScripts);	
		console.log(`waiting for response from crow...`);
		await sleep(15000);
	} else {
		console.log(`Pools state script found, resetting state locally`)
	}
	Crow.run(crowPort, `resetPools()`);
	await sleep(100);
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
ipc.on('run-script', async (event, arg) => {
	Crow.run(crowPort, getStateScript('./src/State2/Globals.lua'));
	await sleep(100);
	Crow.run(crowPort, getStateScript('./src/State2/EventLib.lua'));
	await sleep(100);
	Crow.run(crowPort, getStateScript('./src/State2/DropLib.lua'));
	await sleep(100);
	Crow.run(crowPort, getStateScript('./src/State2/PoolLib.lua'));
	await sleep(100);
	Crow.run(crowPort, getStateScript('./src/State2/State.lua'));
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

ipc.on('remove-event', (event, arg) => {
	State.removeEvent(crowPort, arg);
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

