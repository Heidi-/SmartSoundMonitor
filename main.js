/*
 * Personal sound/noise exposure monitor
 * Developed for WWC and Intel Hackathon 2016
 * See LICENSE.md for license terms and conditions.
 */

"use strict";

var APP_NAME = "IoT Sound Thing";
var cfg = require("./cfg-app-platform.js")();          // init and config I/O resources
var groveSensor = require('jsupm_grove');
var Uln200xa_lib = require('jsupm_uln200xa');          // step motor library
var globalSocket = null; // allows us to push notifications to web app when connected



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



/****************************
 SOUND LEVEL CHECK FUNCTIONS
*****************************/

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
    var limit = 90; // demo level
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



/***************************
    ACTION FUNCTIONS
***************************/

// Instantiate actuators 
var greenLed = new groveSensor.GroveLed(3);
var redLed = new groveSensor.GroveLed(2);
var blueLed = new groveSensor.GroveLed(4);
var motor = new Uln200xa_lib.ULN200XA(4096, 8, 9, 10, 11); // motor
var loudMessageSent = false;
var cumMessageSent = false;

// Four vibration patterns for tactile alerts
function vibrateStartup(){
}

function vibrateTooLoud(){
    runMotor();
}

function vibrateEndTooLoud(){
    stopMotor();
}

function vibrateOverExposure(){
}

// The motor is the prototype stand-in for making vibrations
function runMotor(){
    motor.stepsPerRevolution = 100;
    
    motor.goForward = function()
    {
        motor.setSpeed(5); // 5 RPMs
        motor.setDirection(Uln200xa_lib.ULN200XA.DIR_CW);
        motor.stepperSteps(2);
    };
    
    // Run ULN200xa driven stepper
    motor.goForward();
    setTimeout(motor.reverseDirection, 500);   
}

function stopMotor(){
    motor.release();
}

// Alert user that the device is working by turning on green light 
//    and issuing start-up vibration sequence.
function alertOn(){
    greenLed.on();
    vibrateStartup();
    cumMessageSent = false;
}

// Current sound level is safe; does not reset cumulative alert.
function alertNormal(){
    redLed.off();
    greenLed.on();
}

// Current sound level is unsafe.
function alertLoud(){
    greenLed.off();
    redLed.on();
    vibrateTooLoud();
    if (globalSocket !== null & !loudMessageSent){
        // TODO: reset loudMessageSend every 10 minutes
        globalSocket.emit("alert", "Sound level is dangerous. Immediately reduce exposure.");
        loudMessageSent = true;
    }
}

// Cumulative exposure has reached daily limit. 
function alertOverExposure(){
    greenLed.off();
    blueLed.on();
    vibrateOverExposure();
    if (globalSocket !== null & !cumMessageSent){
        globalSocket.emit("alert", "Daily cummulative sound exposure above level above safe levels.");
        cumMessageSent = true;
    }
}



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

// Magic happens here.
setInterval(function()
{
    /* TODO: enter command for midnight and uncomment
    if (midnight){
        alertOn();
    }
    */
    currentsound = sensor.loudness() * raw2db;
    dailysoundexposure = updateCumulative(measureFrequency, currentsound, dailysoundexposure);
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
        socket.emit("message", currentsound);
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
    globalSocket = socket;
    //Start watching Sensors connected to Galileo board
    startSensorWatch(socket);

    //Attach a 'disconnect' event handler to the socket
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

