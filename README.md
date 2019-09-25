# about *pools*
*pools* is an instrument for composing & performing music with the *crow* Eurorack module by monome, which uses A Slope Language (ASL) as a framework to structure musical events in time.

*pools* is played by changing the content of/relationships between discrete banks of events and "droplets" of musical data.

# usage
* TODO: embed `.gif` of _pools_ being used and write detailed description of usage instructions (use copy from spec)

# development
## setup
### prerequisites
#### Node
* to run _pools_, you have to first install the newest 'LTS' version of node/npm (10.16.3 as of this writing). get it via command line, as instructed here: https://nodejs.org/en/download/package-manager/

#### *druid*
* to reset the Lua environment on _crow_ manually after making changes, you will need to install _druid_, a REPL for direct serial i/o communication with _crow_. installation/usage instructions can be found here: https://github.com/monome/druid 

### get the project
* `git clone https://github.com/isaacpearl/pools.git`
* `cd pools`
* `npm run init` (this will install all required node modules, build _pools_, and create application package files in `pools/dist/linux-unpacked`, `pools/dist/win-unpacked`, and `pools/dist/mac/` respectively)
* if you don't want to build _pools_ yet, you can run `npm run install` instead of `init`

### running _pools_ from source (during development)
* open the `pools` directory in two terminal tabs/windows
* tab 1: `npm start` to start the react development server process
* tab 2: `npm run start-electron` to start the electron app Node server process (print statements from Node and Lua will display here)
  * if you see the error:
  ```
  CONNECTING TO CROW
  error [Error: Error: No such file or directory, cannot open /dev/ttyACM0]
  ```
  _crow_ is probably not connected.

  * If you see:
  ```
  CONNECTING TO CROW
  error [Error: Error: Device or resource busy, cannot open /dev/ttyACM0]
  INITIATING RECONNECT
  ```
  restart the Node process to try again.

  * If you see:

  ```
  CONNECTING TO CROW
  error [Error: Error: Permission denied, cannot open /dev/ttyACM0]
  INITIATING RECONNECT
  ```
  you don't have permissions to talk to crow's USB port.
* the _pools_ application window will open alongside chrominum developer tools (print statements from React will display here)
* if you save changes to the source code while these processes are running, _pools_ will refresh and reflect your changes automatically. If you want to see the results of changes to the Lua scripts, you will have to use _druid_ to send `^^c` and `^^k` messages to _crow_ ([instructions for sending messages with _druid_](https://github.com/monome/druid)), and then restart the Node process manually to reupload them to _crow_

### building/packaging
* `npm run build-n-package` to rebuild the application package after making changes
  * it's important note that you can only build _pools_ for macOS from a mac! If you're on Linux or Windows, remove `--mac` from the `package.json` file's packge instructions  so that under `"scripts":`, the entry for the `package` script reads `"package": "electron-builder build --win --linux -c.extraMetadata.main=build/electron/main.js --publish never"`
  * you may need to install Wine to build for Windows from Linux - if you don't have it, you should get an error message with installation instructions

### setting serial port rights
open a terminal and run `sudo usermod -a -G dialout $USER` to authenticate serial communications with *crow* by default. (TODO: automatically do this configuration in install process) 

## project information 
*pools* is built with Electron and React, using the Serial Node module for communicating with *crow* hardware. 

### file structure
* `src/` contains a folder `react/` with all React components/their css, along with the files that initialize the React virtual DOM (`create-react-app` requires that the React component files be inside a parent folder named `src`) 
  * `src/react` contains the source code for all React components. They are organized into folders containing the React source code (`.js`) and the component's associated styling (`.css`). The `PoolsApp` component contains all top-level state manipulation/logic and communication with the Electron backend - the rest are primarily concerned with rendering UI elements
* `electron/` contains the Electron server (`PoolsServer.js`), and some standard files for initializing the Electron environment
  * `electron/src` contains two modules: `Crow.js`, which handles serial i/o and uploading Lua state/functions to _crow_, and `StateInterface.js`, which is an interface for manipulating the Lua program state from JavaScript
    * `electron/src/State` contains the Lua representation for the _pools_ program state, and libraries for manipulating that state
      * `electron/src/State/DropLib.lua` - drop manipulation
      * `electron/src/State/EventLib.lua` - event manipulation
      * `electron/src/State/GlobalsLib.lua` - initalizes global state variables 
      * `electron/src/State/PoolLib.lua` - pool manipulation
      * `electron/src/State/State.lua` - functions for creating/executing the main ASL loop/translating drop values into appropriate function arguments
      * `electron/src/State/State2.lua` - init/reset functions, BPM setter, `hasPools()` status checker (used to determine whether or not to reupload _pools_ scripts), and pretty print utility function
* `dist/` is the destination for all packaged application binaries
* `build/` contains the source files used to create distributable application packages
* `node_modules/` contains all Node modules (after `npm run init` or `npm run install` are run) - you shouldn't need to do anything with these files
* `package.json` is a file that represents the project metadata, including configurations for run/build/package/etc commands
* `README.md` is the markdown file you're reading right now!

### React components hierarchy
* `PoolsApp` (global program state, interprocess communication with Electron, input handler functions)
  * `EventsContainer` (container for rendering `Event` components, user input for creating/removing events)
    * `Event` (UI representation of events, user input for connecting event function's arguments to different pools)
  * `PoolsContainer` (container for rendering `Pool` components)
    * `Pool` (UI representation of pools, really just a symbol and array of `Drop` components)
      * `Drop` (UI representation of a drop, displays playheads for all event/pool connections, user input for changing drop values)
  * `InfoPanel` (container component for rendering all top-level information/control panels)
    * `TransportControls` (currently just "Start ASL")
    * `BpmEditor` (user input for editing current BPM)

## roadmap
* TODO: write this all out and revise issues accordingly!

