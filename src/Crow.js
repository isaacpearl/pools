//Crow.js
//all crow i/o and serial functions

const SerialPort = require('../node_modules/serialport');
const Readline = require('../node_modules/@serialport/parser-readline');

function checkError(err) {
	if(err) {
		return console.log('Error on write: ', err.message);
	}
}

function writeLua(message) {
	crowPort.write(message, checkError);
}

const upload = (crowPort, script) => {
	writeLua("^^s");
	writeLua(script);
	writeLua("^^e");
	return console.log('Wrote message successfully');
};

const run = (crowPort, script) => {
	writeLua(script);
};

const getVolts2 = (crowPort, crowInput) => {
	var luaString = `print(input[${crowInput}]())\n`;
	crowPort.write(luaString, function(err) {
		if (err) {
			return console.log('Error on write: ', err.message)
		}
		//console.log('message written')
	});

	crowPort.on('readable', function() {
		console.log('data: ', crowPort.read());
	});
};

const getVolts = (crowPort, crowInput) => {
	var luaString = `print(input[${crowInput}]())\n`;
	crowPort.write(luaString, function(err) {
		if (err) {
			return console.log('Error on write: ', err.message)
		}
		//console.log('message written')
	});

	/* Read data that is available but keep the stream in "paused mode"
	crowPort.on('readable', function () {
		console.log('Data:', crowPort.read())
	});
	

	Switches the port into "flowing mode"
	crowPort.on('data', function (data) {
		console.log('Data:', data);
	});
	*/

	// Pipe the data into another stream (like a parser or standard out)
	
	const lineStream = crowPort.pipe(new Readline());
	lineStream.on('data', function(data) {
		console.log(`input: ${crowInput}. data: ${data}.`);
	});

	return lineStream;
};

module.exports = {
	getVolts,
	upload,
	run,
}
