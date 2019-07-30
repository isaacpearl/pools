// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const ipc = require('electron').ipcRenderer;

/*
IPC USAGE:

console.log(ipc.sendSync('synchronous-message', 'ping')) // prints "pong"

ipc.on('asynchronous-reply', (event, arg) => {
  console.log(arg) // prints "pong"
})

ipc.send('asynchronous-message', 'ping')
*/

var refreshButton = document.getElementById("refresh-button");

refreshButton.addEventListener('click', function(){
	ipc.send('run-script', 1);
});


window.setInterval(function(){
	ipc.send('run-script', 1);
},1000);

//clearInterval();
