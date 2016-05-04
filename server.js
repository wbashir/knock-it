// server.js
var express        = require('express');  
var app            = express();  
var httpServer = require("http").createServer(app);  
var five = require("johnny-five");  
var io=require('socket.io')(httpServer);
 
var port = 3000; 

httpServer.listen(port);  
console.log('Server available at http://localhost:' + port);  

var led;
 
//Photon board connection
var Photon = require("particle-io");
var board = new five.Board({
  io: new Photon({
     token: process.env.PARTICLE_TOKEN,
     deviceId: process.env.PARTICLE_DEVICE_ID
  })
});

// board.on("ready", function() {  
//     console.log('Arduino connected');
//     led = new five.Led("D7");
// });

board.on("ready", function() {
  led = new five.Led("D7");
  var secondLed = new five.Led("D0");
  
});
 
//Socket connection handler
io.on('connection', function (socket) {  
        console.log(socket.id);
 
        socket.on('led:on', function (data) {
           led.on();
           console.log('LED ON RECEIVED');
        });
 
        socket.on('led:off', function (data) {
            led.off();
            console.log('LED OFF RECEIVED');
 
        });
    });