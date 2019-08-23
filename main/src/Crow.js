//Crow.js
//all crow i/o and serial functions

const SerialPort = require('../node_modules/serialport');
const Readline = require('../node_modules/@serialport/parser-readline');

function checkError(err) {
	if(err) {
		return console.log('Error on write: ', err.message);
	}
}

function writeLua(crowPort, message) {
	crowPort.write(message, checkError);
}

//is there a way to do this without passing in crowPort, but without making Crow.js a singleton?
const upload = (crowPort, script) => {
	writeLua(crowPort, "^^s");
	writeLua(crowPort, script+"\n");
	writeLua(crowPort, "^^e");
	//return console.log('Wrote message successfully');
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const uploadMultiple = async (crowPort, scripts) => {
	console.log(`uploading scripts`);
	var fileNames = Object.keys(scripts);
	writeLua(crowPort, "^^s");
	for (var i = 0; i < fileNames.length; i++) {
		console.log(`writing ${fileNames[i]}`)
		writeLua(crowPort, scripts[fileNames[i]]+"\n");
		await sleep(500);
	}
	await sleep(500);
	writeLua(crowPort, "^^e");
};

const run = (crowPort, script) => {
	writeLua(crowPort, (script+"\n"));
};

const close = (crowPort) => {
	crowPort.close(checkError);	
}

module.exports = {
	upload,
	uploadMultiple,
	run,
	close
}
