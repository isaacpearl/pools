# *pools*

## about
*pools* is an instrument for composing & performing music with the *crow* Eurorack module by monome, which uses A Slope Language (ASL) as a framework to structure musical events in time.

*pools* is played by changing the content of/relationships between discrete banks of events and "droplets" of musical data.

## development

### setup
first, run `sudo usermod -a -G dialout $USER` to allow communications with *crow* over /dev/ttyACM0 by default. (TODO: automatically do this configuration in install process) 

to run *pools*, clone this repo and run `npm install` in both the `main` and `renderer` directories. running `npm start` in the `main` directory starts the application. 

to build *pools*, do `npm run dist` in the `main` directory.

### application architecture
*pools* is built with Electron and React, using the Serial Node module for communicating with *crow* hardware. The state of the core musical system is stored as a series of Lua functions/tables in `State.lua`, and the Electron server sends calls to these functions via the serial port to manipulate state on *crow*.
