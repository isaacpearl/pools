//Crow.js
//all crow i/o and serial functions
//TODO: decide where the serial port connection should be opened (should only happen once)

const SerialPort = require('./node_modules/serialport');
const Readline = require('./node_modules/@serialport/parser-readline');

function checkError(err) {
	if(err) {
		return console.log('Error on write: ', err.message);
	}
}

const uploadScript = (crowPort, script) => {
	crowPort.write("^^s", checkError);
	crowPort.write(script, checkError);
	crowPort.write("^^e", checkError);
	//maybe return something here to indicate success?
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
	var funcCounter = 0
	lineStream.on('data', function(data) {
		console.log(`input: ${crowInput}. counter: ${funcCounter}. data: ${data}.`);
		funcCounter += 1;
		drawInput(data, crowInput);
	});

	return lineStream;
};

module.exports = {
	getVolts,
	uploadScript,
}
