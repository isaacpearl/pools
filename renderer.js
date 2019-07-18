// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const SerialPort = require('./node_modules/serialport');
const Readline = require('./node_modules/@serialport/parser-readline');
const crowPort = new SerialPort('/dev/ttyACM0', {
	baudRate: 115200 
})

function getLua(){
	/*
	TODO: get/set sketch.lua and send as script 
	*/
	var script = "print(input[1]())\n";
	return script;
}

function getVolts2(crowInput) {
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
}

function getVolts(crowInput) {
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
}

function drawInput(val, inputNum) {
	document.getElementById(`input${inputNum}`).innerHTML = val;
}

window.setInterval(function(){
	//call this code every 500 milliseconds
	getVolts(1);
	getVolts(2);
},1000);

/*
for (var i=0; i < 1; i++) {
	console.log("running in a loop!");
	getVolts2(1);
	getVolts2(2);
}
*/

//clearInterval();
