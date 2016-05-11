'use strict';

//var app = angular.module('AngularDrumMachine', ['ngRoute']);
var app = angular.module('AngularDrumMachine', ['btford.socket-io'])
.factory('mySocket', function (socketFactory) {
        var socket = io.connect("https://knock-it.herokuapp.com");
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
