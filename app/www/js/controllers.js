angular.module('starter.controllers', ['ngCordova',
                                        'starter.services'])

.controller('MapCtrl', function($scope) {

})

.controller('ActivityCtrl', function($scope, $cordovaDeviceMotion, settings, $interval) {
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

         $scope.upload_data($scope.measurements);

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




	$(window).on("resize.doResize", function (){
      $scope.$apply(function(){
        ctx.canvas.width = window.innerWidth - 10;
        ctx.canvas.height = window.innerHeight - window.innerHeight / 2;
      });
    });

	$scope.x = 0;
	$scope.offset = 0;
	$scope.attacking = true;
	$scope.road_data = [];
	$scope.first_hit = [];
	$scope.last_hit = [];

	function set_initial_data() {
	  ctx.canvas.width = window.innerWidth - 10;
      ctx.canvas.height = window.innerHeight / 2;
	  $scope.road_data.push([0, 100]);
	  $scope.last_hit =  [0, 100];
	  $scope.first_hit = [0, 100];
	}

	var canvas  = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	$scope.click = function() {
	  $scope.road_data.push([$scope.x+5, 100]);
	  $scope.road_data.push([$scope.x+6, 105]);
	  $scope.road_data.push([$scope.x+7, 105]);
	  $scope.road_data.push([$scope.x+8, 110]);
	  $scope.road_data.push([$scope.x+9, 110]);
	  $scope.road_data.push([$scope.x+10, 110]);
	  $scope.road_data.push([$scope.x+11, 113]);
	  $scope.road_data.push([$scope.x+12, 113]);
	  $scope.road_data.push([$scope.x+13, 115]);
	  $scope.road_data.push([$scope.x+14, 115]);
	  $scope.road_data.push([$scope.x+15, 115]);
	  $scope.road_data.push([$scope.x+16, 117]);
	  $scope.road_data.push([$scope.x+17, 117]);
	  $scope.road_data.push([$scope.x+18, 115]);
	  $scope.road_data.push([$scope.x+19, 114]);
	  $scope.road_data.push([$scope.x+20, 112]);
	  $scope.road_data.push([$scope.x+21, 112]);
	  $scope.road_data.push([$scope.x+22, 112]);
	  $scope.road_data.push([$scope.x+23, 110]);
	  $scope.road_data.push([$scope.x+24, 107]);
	  $scope.road_data.push([$scope.x+25, 103]);
	  $scope.road_data.push([$scope.x+26, 100]);
	}

	$scope.upload_data = function(measurements) {
		$scope.road_data.push([$scope.x+1, parseInt(measurements.z)+$scope.road_data[0][1]]);
	}

	$scope.start_attack = function() {
	  console.log($scope.road_data, $scope.last_hit, $scope.first_hit, $scope.x);
	  $scope.attacking = !$scope.attacking;
	}

	function iterate_for_drawing() {
	  ctx.beginPath();
	  for (var x = 0; x < $scope.road_data.length; x++) {
	    
	      if(x > 0) {
	        if(x == $scope.road_data.length-1 && $scope.x >= $scope.road_data[x][0]) {
	          var last_data = $scope.road_data[x];
	          var over_last_data = $scope.road_data[x-1];
			  draw(last_data[0], last_data[1], $scope.x, $scope.road_data[0][1]);
			  draw(over_last_data[0], over_last_data[1], last_data[0], last_data[1]);
	        } else if($scope.x >= $scope.road_data[x-1][0]) {
	          var last_road = $scope.road_data[x-1];
	          var road_data = $scope.road_data[x];
	          draw(last_road[0], last_road[1], road_data[0], road_data[1]);
	      }
	      } else {
	        var road_data = $scope.road_data[0];
	        if($scope.road_data.length > 1) {
	  var first_road = $scope.road_data[1];
	          draw(road_data[0], road_data[1], first_road[0], first_road[1]);
	        } else {
	          draw(road_data[0], road_data[1], $scope.x, road_data[1]);
	        }

	      }
	}
	ctx.stroke();
	}

	function draw(x_start, y_start, x_end, y_end) {
	  ctx.moveTo(x_start-$scope.offset, y_start);
	  ctx.lineTo(x_end-$scope.offset, y_end);
	}

	function start_animation_loop() {
	    set_initial_data();
	    $scope.promise = $interval(function() {
	        animate();
	    }, 100 );
	}

	function animate() {
	  if($scope.attacking == true) {
	  	  if($scope.x > window.innerWidth/2) {
	  	  	$scope.offset++;
	  	  }
	      clear_canvas();
	      $scope.x++;
	      iterate_for_drawing();
	  }
	    
	}

	function clear_canvas() {
	    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	}

	start_animation_loop();




})

.controller('SettingsCtrl', ['$scope', 'settings', function($scope, settings) {
  $scope.frequency = settings.getFrequncy();  
  $scope.deviation = settings.getDiviation();
  $scope.setOptions = function() {
    settings.setFrequency($scope.frequency); 
    settings.setDeviation($scope.deviation); 
  };  
}]);
