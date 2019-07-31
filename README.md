# *pools*
*pools* is an instrument for composing & performing music with the *crow* Eurorack module by monome, which uses A Slope Language (ASL) as a framework for structuring musical events in time.

*pools* is played by changing the content of/relationships between discrete banks of events and "droplets" of musical data.

## development
first, run `sudo usermod -a -G dialout $USER` to allow communications with *crow* over /dev/ttyACM0 by default. (TODO: automatically do this configuration in install process) 

to run *pools*, clone this repo and run `npm install` in both the `main` and `renderer` directories. running `npm start` in the `main` directory starts the application. 

to build *pools*, do `npm run dist` in the `main` directory.
