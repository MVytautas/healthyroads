angular.module('starter.controllers', ['ngCordova',
                                        'starter.services'])

.controller('MapCtrl', function($scope) {

})

.controller('ActivityCtrl', function($scope, $cordovaDeviceMotion, settings) {
  // watch Acceleration options
  $scope.options = settings.getOptions();
  // Current measurements
  $scope.measurements = {
      x : null,
      y : null,
      z : null,
      timestamp : null
  };
   
  // Previous measurements    
  $scope.previousMeasurements = {
      x : null,
      y : null,
      z : null,
      timestamp : null
  };

    //Start Watching method
  $scope.startWatching = function() {     
   
      // Device motion configuration
      $scope.watch = $cordovaDeviceMotion.watchAcceleration($scope.options);
   
      // Device motion initilaization
      $scope.watch.then(null, function(error) {
          console.log('Error');
      }, function(result) {
   
          // DATA FROM ACCELEROMETER 
          $scope.measurements.x = result.x;
          $scope.measurements.y = result.y;
          $scope.measurements.z = result.z;
          $scope.measurements.timestamp = result.timestamp;                 
         // TODO send data to service

          // Detecta shake  
          $scope.detectShake(result);  
   
      });     
  };
  // Stop watching method
  $scope.stopWatching = function() {  
      $scope.watch.clearWatch();
  };

  // Detect shake method      
  $scope.detectShake = function(result) { 
   
      //Object to hold measurement difference between current and old data
      var measurementsChange = {};
   
      // Calculate measurement change only if we have two sets of data, current and old
      if ($scope.previousMeasurements.x !== null) {
          measurementsChange.x = Math.abs($scope.previousMeasurements.x, result.x);
          measurementsChange.y = Math.abs($scope.previousMeasurements.y, result.y);
          measurementsChange.z = Math.abs($scope.previousMeasurements.z, result.z);
      }
   
      // If measurement change is bigger then predefined deviation
      if (measurementsChange.x + measurementsChange.y + measurementsChange.z > $scope.options.deviation) {
          $scope.stopWatching();  // Stop watching because it will start triggering like hell
          console.log('Shake detected'); // shake detected
          setTimeout($scope.startWatching(), 1000);  // Again start watching after 1 sex
   
          // Clean previous measurements after succesfull shake detection, so we can do it next time
          $scope.previousMeasurements = { 
              x: null, 
              y: null, 
              z: null
          }               
   
      } else {
          // On first measurements set it as the previous one
          $scope.previousMeasurements = {
              x: result.x,
              y: result.y,
              z: result.z
          }
      }           
   
  };

})

.controller('SettingsCtrl', ['$scope', 'settings', function($scope, settings) {
  $scope.frequency = settings.getFrequncy();  
  $scope.deviation = settings.getDiviation();
  $scope.setOptions = function() {
    settings.setFrequency($scope.frequency); 
    settings.setDeviation($scope.deviation); 
  };  
}]);
