// server.js
var express        = require('express');  
var bodyParser = require("body-parser");
var httpServer = require("http").createServer(app);  
var five = require("johnny-five");  
var io=require('socket.io')(httpServer);
 
var port = 3000; 
var app            = express();  
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// httpServer.listen(port);  
 // Initialize the app.
var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});


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
           if (key in ledDict){
             ledDict[key].on()
             console.log('Turning ON ' + key);
           }
        });

        socket.on('led:toggle', function (key) {
           if (key in ledDict){
             ledDict[key].toggle()
             console.log('Toggle' + key);
           }
        });
 
        socket.on('led:off', function (k) {
            if(k){
                // board.wait(300,function(){
                //     ledDict[k].stop.off();
                // });
                ledDict[k].stop().off();
            }
            else {
              for(var k in ledDict){
                console.log("Turn Off " + k);
                ledDict[k].stop().off(); // u
              }
            }
        });

        socket.on('led:blink', function(key, delay){
             if (key in ledDict){
                if(key == "D0"){
                  console.log('Blink' + key);
                }
                ledDict[key].blink(delay)
            }      
        });

        socket.on('led:pulse', function(key, delay){
             if (key in ledDict){
                if(key == "D0"){
                  console.log('Pulse' + key);
                }
                ledDict[key].pulse()
            }      
        });
    });