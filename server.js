// server.js
var express        = require('express');  
var app            = express();  
var httpServer = require("http").createServer(app);  
var five = require("johnny-five");  
var io=require('socket.io')(httpServer);
 
var port = 3000; 

httpServer.listen(port);  
console.log('Server available at http://localhost:' + port);  

var led0, led1, led2, led3;
var ledDict = {
  "D0": led0,
  "D1": led1,
  "D2": led2,
  "D3": led3 
}
 
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

  // iterate the LED dictionary and get each stored led variable to 
  // create a new Johnny Five LED object
  for (var key in ledDict) {
    ledDict[key] = new five.Led(key);
  }

  // led = new five.Led("D7");
  // var secondLed = new five.Led("D0");
});
 
//Socket connection handler
io.on('connection', function (socket) {  
        console.log(socket.id);
 
        socket.on('led:on', function (key) {
           console.log(key);
           if (key in ledDict){
             ledDict[key].on()
             console.log('Turning ON ' + key);
           }
        });
 
        socket.on('led:off', function (key) {
            console.log(key);
            if (key in ledDict){
              ledDict[key].off()
            }
            console.log('LED OFF');
        });
    });