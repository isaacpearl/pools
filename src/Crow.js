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
	writeLua(crowPort, script);
	writeLua(crowPort, "^^e");
	return console.log('Wrote message successfully');
};

const run = (crowPort, script) => {
	writeLua(crowPort, script);
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
};

module.exports = {
	getVolts,
	upload,
	run,
}
