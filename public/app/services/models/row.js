'use strict';

var Row = function(instrument, initialBeats) {
  var instrument = instrument;
  var beats = [];

  // Add initial beats
  addBeats(initialBeats);

  function getInstrument() {
    return instrument;
  }

  function getBeats() {
    return beats;
  }

  function addBeats(num) {
    for(var i = 0; i < num; i++) {
      beats.push(new Beat());
    }
  }

  function reset() {
    for(var i = 0; i < beats.length; i++) {
      beats[i].deactivate();
    }
  }

  function playSound(index, mySocket, row) {
    if (beats[index].isActive()) {
      // console.log(beats[index].isActive());
      //  // Make sure the callback is a function​
      // if (typeof callback === 'function') {
      // // Call it, since we have confirmed it is callable​
      //     callback(index);
      // }
      mySocket.emit('led:on', "D" + row); 
      return instrument.play();
    }
    else{
      mySocket.emit('led:off', "D" + row); 
    }

    return false;
  }


  // Return public functions
  return {
    getInstrument: getInstrument,
    getBeats: getBeats,
    addBeats: addBeats,
    reset: reset,
    playSound: playSound
  }
};
