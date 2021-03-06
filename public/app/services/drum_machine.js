'use strict';

// drumMachine Model
app.factory('drumMachine', function($http, $q, timerQueue, mySocket) {
  // Private variables
  var _playing = false;
  var _currentBeat = 0;
  var _delay = 100;
  var _gridLength = 16;
  var _tempo = 120;
  var _timers = timerQueue;
  var _rows = [];


  function loadInstruments(instrumentFile) {
    var item, player, instrument;
    var file = instrumentFile || "/app/services/data/instruments/kit-1.json";

    return $http.get(file).then(function(response) {
      for(var i = 0; i < 4; i++) {
        item = response.data.instruments[i];
        player = new Howl({ urls: ["assets/audio/" + item.file] });
        instrument = new Instrument(player, item);

        _rows.push(new Row(instrument, _gridLength));
      }
      return "Instruments Loaded";
    });
  }

  function loadSequence(sequenceFile) {
    var file = sequenceFile || "/app/services/data/sequences/seq-1.json";

    reset();

    return $http.get(file).then(function(response) {
      _gridLength = response.data.gridLength;
      setTempo(response.data.tempo);

      for(var i = 0; i < 4; i++) {
        for(var j = 0; j < _gridLength; j++) {
          if (response.data.rows[i][j] === "1") {
            _rows[i].getBeats()[j].activate();
          } else {
            _rows[i].getBeats()[j].deactivate();
          }
        }
      }
      return "Sequence Loaded";
    });
  }

  function rows() {
    return _rows;
  }

  function tempo() {
    return _tempo;
  }

  function gridLength() {
    return _gridLength;
  }

  function currentBeat() {
    return _currentBeat;
  }

  function setTempo(newTempo) {
    _tempo = newTempo;
    _delay = beatDelay();
  }

  function play() {
    _playing = true;
    _timers.add(playBeat(), beatDelay());
    
  }

  function stop() {
    turnOffLeds();
    _playing = false;
    _timers.clear();
  }

  function reset() {
    stop();
    _currentBeat = 0;
    resetAllRows();
  }

  // Benchmark Code
  //var lastTime = new Date().getTime();
  function playBeat() {
    return function() {
      //var thisTime = new Date().getTime();
      //console.log("Delay: " + _delay + " Diff: " + (thisTime - lastTime));
      //lastTime = thisTime;
      if (_currentBeat >= _gridLength) {
        _currentBeat = 0;
      }

      for (var i = 0; i < _rows.length; i++) {
        _rows[i].playSound(_currentBeat, mySocket, i);
        
      }
      // turnOnLeds();
      _currentBeat += 1;

      _timers.add(playBeat(), _delay);
    };
  }

  function resetAllRows() {
    for(var i = 0; i < _rows.length; i++) {
      _rows[i].reset();
    }
  }

  function beatDelay() {
    return (1000 / (_tempo * 2) * 60);
  }

  function turnOnLeds(){
      
      for (var i = 0; i < _rows.length; i++) {
        
        var obj = _rows[i];
        // iterate over the playing beat
        for(var j = 0; j < obj.getBeats().length; j++){
            var beat = obj.getBeats()[j];
            // if the beat is active, turn on the led using the key (D0)
            if(beat.isActive() == true){
               // console.log("i : j" + i + " " + j);
               mySocket.emit('led:blink', "D" + i, tempo()); 
            }
            else {
              // console.log("i : j" + i + " " + j);
              // mySocket.emit('led:off', "D" + i);
            }
          }
      }
  }

  function turnOffLeds(){
    mySocket.emit('led:off');
  }

  // Return public functions
  return {
    loadInstruments: loadInstruments,
    loadSequence: loadSequence,
    gridLength: gridLength,
    currentBeat: currentBeat,
    rows: rows,
    tempo: tempo,
    setTempo: setTempo,
    play: play,
    stop: stop,
    reset: reset,
    turnOnLeds: turnOnLeds,
    turnOffLeds:turnOffLeds
  }

});
