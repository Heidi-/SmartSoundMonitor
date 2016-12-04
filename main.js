/*
 * A simple Node.js application to blink the onboard LED.
 * Supported Intel IoT development boards are identified in the code.
 *
 * See LICENSE.md for license terms and conditions.
 *
 * https://software.intel.com/en-us/html5/articles/intel-xdk-iot-edition-nodejs-templates
 */

// keep /*jslint and /*jshint lines for proper jshinting and jslinting
// see http://www.jslint.com/help.html and http://jshint.com/docs
/* jslint node:true */
/* jshint unused:true */

"use strict";

var APP_NAME = "IoT Sound Thing";
var cfg = require("./cfg-app-platform.js")();          // init and config I/O resources
var groveSensor = require('jsupm_grove');


console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");   // poor man's clear console
console.log("Initializing " + APP_NAME);


// confirm that we have a version of libmraa and Node.js that works
// exit this app if we do not
cfg.identify() ;                // prints some interesting platform details to console

if( !cfg.test() ) {
    process.exitCode = 1 ;
    throw new Error("Call to cfg.test() failed, check console messages for details.") ;
}

if( !cfg.init() ) {
    process.exitCode = 1 ;
    throw new Error("Call to cfg.init() failed, check console messages for details.") ;
}

// configure (initialize) our I/O pins for usage (gives us an I/O object)
// configuration is based on parameters provided by the call to cfg.init()
cfg.io = new cfg.mraa.Gpio(cfg.ioPin, cfg.ioOwner, cfg.ioRaw);
cfg.io.dir(cfg.mraa.DIR_OUT);                  // configure the LED gpio as an output
console.log("Using LED pin number: " + cfg.ioPin);




// TODO: separate into soundlevel.js
function isOverDailyLimit(cumulative) {
    // var dailyLimit = 4.5; // time_interval * log(decibel_reading) <= 4.5 is safe level
    var dailyLimit = 0.01; // demo level
    if (cumulative > dailyLimit) {
        return true;
    }
    else {
        return false;
    }
}

function isOverDangerLimit(soundLevel){
    // var limit = 115; // Do not exceed exposure for more than 15 minutes.
    var limit = 30; // demo level
    if (soundLevel > limit) {
        return true;
    }
    else {
        return false;
    }
}

function updateCumulative(deltaT, soundLevel, currCumulative) {
    var deltaT_hr = deltaT/(1000 * 60 * 60);
   return currCumulative + deltaT_hr * Math.log(soundLevel);
}
// end soundlevl.js


// TODO: separate into actions.js
// Instantiate LED actuators 
var greenLed = new groveSensor.GroveLed(3);
var redLed = new groveSensor.GroveLed(2);
var blueLed = new groveSensor.GroveLed(4);
// TODO: add motor 

/* Alert user that the device is working by turning on green light 
    and issuing start-up vibration sequence.
*/
function alertOn(){
    greenLed.on();
    // TODO: startup vibration
}

/* Current sound level is safe; does not reset cumulative alert.*/
function alertNormal(){
    redLed.off();
    greenLed.on();
    // TODO: vibration to notify that red alert has been removed.
}

/* Current sound level is unsafe. */
function alertLoud(){
    greenLed.off();
    redLed.on();
    // TODO: instantanous loud vibration
    // TODO: emit message to socket. Something along the lines of:
    //          "Sound level is dangerous. Immediately reduce exposure."
}

/* Cumulative exposure has reached daily limit. */
function alertOverExposure(){
    greenLed.off();
    blueLed.on();
    // TODO: cumulative exposure vibration
    // TODO: emit message to socket. Something along the lines of:
    //      "Daily cummulative sound exposure above level above safe levels."
}
// end actions.js




//Sound Sensor code snippet START
var sensorObj = require('jsupm_loudness');

// Instantiate a Loudness sensor on analog pin A0, with an analog
// reference voltage of 5.0
var sensor = new sensorObj.Loudness(0, 5.0);



// Initialize variables
var dailysoundexposure = 0.0;
var currentsound = 0.0;
var measureFrequency = 5; // time interval in msec to measure sound level and update
var raw2db = 26; // conversion from raw measurment to decibel

alertOn();

setInterval(function()
{
    /* TODO: enter command for midnight and uncomment
    if (midnight){
        alertOn()
    }
    */
    currentsound = sensor.loudness() * raw2db;
    dailysoundexposure = updateCumulative(measureFrequency, currentsound, dailysoundexposure);
    console.log("cumulative: " + dailysoundexposure); 
  if (isOverDangerLimit(currentsound)){
       alertLoud();
    }  else {
      alertNormal();
    } 
    if (isOverDailyLimit(dailysoundexposure)) {
        alertOverExposure();
    }
}, measureFrequency);

//incorporate into actions?
function startSensorWatch(socket){
    var graphfrequency = 500;
    setInterval(function()
    {
        socket.emit("message", sensor.loudness());
    }, graphfrequency);
}

// exit on ^C
process.on('SIGINT', function()
{
    sensor = null;
    sensorObj.cleanUp();
    sensorObj = null;
    console.log("Exiting.");
    process.exit(0);
});



//Create Socket.io server
var http = require('http');
var app = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('<h1>Hello world from Intel IoT platform!</h1>');
}).listen(1337);
var io = require('socket.io')(app);

console.log("Sample Reading Touch Sensor");

//Attach a 'connection' event handler to the server
io.on('connection', function (socket) {
    console.log('a user connected');
    //Emits an event along with a message
    socket.emit('connected', 'Welcome');

    //Start watching Sensors connected to Galileo board
    startSensorWatch(socket);

    //Attach a 'disconnect' event handler to the socket
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

