//modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron');
const path = require('path');
const os = require('os');

/*
 * by keeping a global reference of the window object,
 * we prevent the window from being automatically closed
 * when the JavaScript object is garbage collected
 */
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

//create window after init
app.on('ready', createWindow);

//quit when all windows are closed
app.on('window-all-closed', function () {
	//we quit application on window close, unless running on macOS
	if (process.platform !== 'darwin') app.quit();
});

//create window when activated if no window is present
app.on('activate', function () {
	if (mainWindow === null) createWindow();
});


//MAIN PROGRAM
require("./PoolsServer.js");
