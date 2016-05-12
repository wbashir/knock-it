'use strict';

//var app = angular.module('AngularDrumMachine', ['ngRoute']);
var app = angular.module('AngularDrumMachine', ['btford.socket-io'])
.factory('mySocket', function (socketFactory) {
        var socket = io.connect(window.location.hostname);
        
        socket.on('status', function (data) {  
            $('#status').html(data.status);
        });

        return socket;
    });

app.run(['drumMachine', '$q', '$rootScope', '$timeout', function(drumMachine, $q, $rootScope, $timeout) {
  $rootScope.loading = true;

  drumMachine.loadInstruments().then(function(result) {
    drumMachine.loadSequence().then(function(result) {
      $rootScope.machine = drumMachine;
      $rootScope.tempo = drumMachine.tempo.call(this);
      $rootScope.loading = false;
    })
  });
}]);
