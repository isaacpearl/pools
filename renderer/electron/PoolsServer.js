const Crow = require("./src/Crow.js");
const State = require("./src/StateInterface.js");
const {app, BrowserWindow} = require('electron'); 
const fs = require("fs"); 
const path = require('path'); 
const os = require('os'); 
const url = require('url');
const ipc = require('electron').ipcMain; 
const SerialPort = require('serialport'); 
const Readline = require('@serialport/parser-readline'); 
var crowPort, lineStream;

async function init() {
	crowPort = await connectCrow(); 
	console.log(`crowPortL: ${crowPort}`);
	lineStream = crowPort.pipe(new Readline({ delimiter: '\r' })); 
	lineStream.on('data', function(data) {
		getFullMessage(data);
	});

	crowPort.on('open', function() {
		console.log("refreshing lua environment")
		State.resetLua(crowPort);
	});

	crowPort.on('close', function () {
		console.log('CROW PORT CLOSED');
		reconnectCrow();
	});

	crowPort.on('error', function (err) {
		console.error("error", err);
		reconnectCrow();
	});
}

let mainWindow;
var hasPools = false;
var poolsIsLoaded = false;

init();

ipc.on('get-indices', (event, arg) => {
	Crow.run(crowPort, `print(events[1].i)`);
});

ipc.on('test-print', (event, arg) => {
	Crow.run(crowPort, `print('${arg}')`);
});

ipc.on('connect-pool', (event, arg) => {
	State.connectPool(crowPort, arg[0], arg[1], arg[2]);
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
	State.setBehavior(crowPort, arg[0], arg[1], arg[2]);
});

ipc.on('set-bpm', (event, arg) => {
	State.setBpm(crowPort, arg);
});

ipc.on('reset-lua', (event) => {
})

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

ipc.on('upload-script', async (event, arg) => {
	await sleep(100);
	console.log(`Checking for Pools state script on Crow...`)
	Crow.run(crowPort, `hasPools()`);
	await sleep(100);
	if (!hasPools) {
		console.log(`Pools state script not found, attempting to upload`)
		stateScripts = {};
		var stateFiles = fs.readdirSync(path.join(__dirname, '/src/State'));
		for (var i = 0; i < stateFiles.length; i++) {
			var filePath = path.join(__dirname, `/src/State/${stateFiles[i]}`);
			if (filePath.substr(filePath.length-4) === ".lua") {
				stateScripts[stateFiles[i]] = getStateScript(filePath);
			}
		}
		Crow.uploadMultiple(crowPort, stateScripts);	
		//console.log(`waiting for response from crow...`);
		await sleep(5000);
	} else {
		console.log(`Pools state script found, resetting state locally`)
	}
	Crow.run(crowPort, `resetPools()`);
	await sleep(100);
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createWindow () { 
	mainWindow = new BrowserWindow({ width: 1200,
    	height: 900,
		resizable: false,
    	webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true
    	}
	});
	
	const startUrl = process.env.ELECTRON_START_URL || url.format({
    	pathname: path.join(__dirname, '../index.html'),
    	protocol: 'file:',
    	slashes: true,
  	});

	console.log(`startUrl: ${startUrl}`);

	mainWindow.loadURL(startUrl)
	//mainWindow.loadURL('http://localhost:3000');
	mainWindow.webContents.openDevTools({mode: 'undocked'});

	/*
	if (process.env.NODE_ENV === 'dev') { 
		mainWindow.loadURL('http://localhost:3000');
		mainWindow.webContents.openDevTools({mode: 'undocked'});
	} else {
		console.log("prod");
		mainWindow.loadURL(`file://${__dirname}/build/html/build/index.html`);
	};
	*/
	
 	//dereference window object when the window is closed
 	mainWindow.on('closed', function () {
		mainWindow = null;
	});
	
	//load react developer tools
	//TODO: store this extension in the project so local user updates
	//don't invalidate this filepath
	BrowserWindow.addDevToolsExtension(path.join(os.homedir(), '/.config/google-chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.0.6_0'));
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

async function getCrowPort() {
	var ports = await SerialPort.list();
	var portpath = "";
	ports.forEach((item) => {
		if (item.vendorId == 0483 && item.productId == 5740) {
			console.log(item.manufacturer);
			portPath = item.comName;
		}
	})
	console.log(`portPath: ${portPath}`);
	return portPath
}

async function connectCrow() {
	console.log("CONNECTING TO CROW");
	var crow;
	const port = await getCrowPort();
	try {
		crow = new SerialPort(port, {
			baudRate: 115200,
		});
	} catch (err) {
		console.log(`error on connection: ${err.message}`);
		reconnectCrow();
	}
	return crow;
} 

// check for connection errors or drops and reconnect (currently not working)
function reconnectCrow() {
  console.log('INITIATING RECONNECT');
  setTimeout(function(){
    console.log('RECONNECTING TO CROW');
    connectCrow();
  }, 2000);
};
