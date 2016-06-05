angular.module('starter.controllers', ['ngCordova',
                                        'starter.services'])

.controller('MapCtrl', function($scope) {

})

.controller('ActivityCtrl', function($scope, $cordovaDeviceMotion, settings, $interval, $rootScope, $http, data_processor) {
  // Current measurements
  $scope.avarage = 0;
  console.log("Activity controller init ");
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
      $scope.attacking = true;     
   
      // Device motion configuration
      $scope.watch = $cordovaDeviceMotion.watchAcceleration(settings.getOptions());
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
         calculateAverage(result.z);
         $scope.coolFunction = function() {
            $http.post('/Users/Vytautas/node-workshop/02-exercises/01-db/badroads/app', $scope.result).then(function(data) {
              console.log("I am here");
              $scope.msg = 'Data saved';
            });
            console.log("json add");
            $scope.msg = 'Data sent: '+ JSON.stringify($scope.result);
          };

          $scope.$on('eventFired', function(event, data) {
            $scope.coolFunction();
          })

         $scope.calculateAverage = function(data){ 
            data_processor.add_data(data);
          };

        //$scope.msg = 'Data sent: '+ JSON.stringify($scope.result);
        //var t = new data_processor();
        //$scope.myJsonContents = t.$get({x: $scope.measurements.x, y: $scope.measurements.y, z: $scope.measurements.z});
        //$scope.recentTransactions = t.$getRecent();
        //$scope.transactions = t.$get({x: $scope.measurements.x, y: $scope.measurements.y, z: $scope.measurements.z });

         $scope.upload_data($scope.measurements);

          // Detecta shake  
          $scope.detectShake(result);  
   
      });     
  };
  // Stop watching method
  $scope.stopWatching = function() {
    if (typeof $scope.watch != 'function' ) {
  	  $scope.attacking = false; 
      $scope.watch.clearWatch();
    }
  }

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
      opt = settings.getOptions();
      // If measurement change is bigger then predefined deviation
      if (measurementsChange.x + measurementsChange.y + measurementsChange.z > opt.deviation) {
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

  // Options update event handler
  $rootScope.$on('options_update', function(evt) {
      $scope.options = settings.getOptions();
  });


  $(window).on("resize.doResize", function (){
      $scope.$apply(function(){
        ctx.canvas.width = window.innerWidth - 10;
        ctx.canvas.height = 270;
      });
    });

	$scope.x = 0;
	$scope.offset = 0;
	$scope.attacking = false;
	$scope.road_data = [];
	$scope.first_hit = [];
	$scope.last_hit = [];
    var clicked = false;
    var start_dump = [];
    var end_dump = [];
    var dumps_array = [];
    var selected_frame = 0;
    var dumb_draw = false;
    var dumb_data = [-5, 6, -7, 5, 5, -9, 5, -3, 3, 3, 6, -9, -12, -18, -19, -20, -20, -20, -20, -20];
    var dump_coordinats = [];

  function set_initial_data() {
    ctx.canvas.width = window.innerWidth - 10;
      ctx.canvas.height = 270;
    var centeredHeight = ctx.canvas.height / 2;
    
    $scope.road_data.push([0, 100]);
    $scope.last_hit =  [0, 100];
    $scope.first_hit = [0, 100];
  }

	var canvas  = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	$scope.click = function() {
      clicked = true;
      selected_frame = $scope.x;
	}

  $scope.upload_data = function(measurements) {
      var z = measurements.z;
      var last = $scope.road_data.length-1;
      if($scope.road_data[last][2] != 'added') {
        $scope.road_data.push([$scope.x-2, $scope.road_data[0][1]]);
        
        if(z > 2 || z < -2) {
          dump_coordinats.push([$scope.x-2, parseInt(z*3)+$scope.road_data[0][1], z]);
  	      dumb_draw = true;
  	      start_dump = [$scope.x-2, $scope.road_data[0][1]];
  	    } else {
  	      dumb_draw = false;
  	      if(start_dump.length > 0 && end_dump.length > 0) {
  	      	dumps_array.push([start_dump, end_dump]);
  		      start_dump = [];
  		      end_dump = [];
  	      }
  	      
  	    }
      }
      $scope.road_data.push([$scope.x-1, parseInt(z*3)+$scope.road_data[0][1], 'added']);
      end_dump = [$scope.x-1, parseInt(z*3)+$scope.road_data[0][1], 'added'];
      if(z > 2 || z < -2) {
        dumb_draw = true;
        dump_coordinats.push([$scope.x-2, parseInt(z*3)+$scope.road_data[0][1], z]);
      }
  }

	$scope.start_attack = function() {
	  $scope.attacking = !$scope.attacking;
	}


  function iterate_for_drawing() {
    for (var x = 0; x < $scope.road_data.length; x++) {
          ctx.beginPath();
          ctx.strokeStyle='#EF233C';
          if(x > 0) {
            if(x == $scope.road_data.length-1 && $scope.x >= $scope.road_data[x][0]) {
              var last_data = $scope.road_data[x];
              var over_last_data = $scope.road_data[x-1];
          draw(over_last_data[0], over_last_data[1], last_data[0], last_data[1]);
          if(last_data[1] == $scope.road_data[0][1]) {
            draw(last_data[0], last_data[1], $scope.x, $scope.road_data[0][1]);
          }
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
        ctx.lineWidth=2;
        ctx.lineCap = 'round';
        ctx.stroke();
    }
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
	          $scope.offset+=4;
	        }
	        if(clicked == true) {
	            add_dumb_data();
	          }
	          var last = $scope.road_data.length-1;
	          if($scope.road_data[last][2] == 'added' && $scope.road_data[last][0] < $scope.x-1) {
	            $scope.road_data.push([$scope.x, $scope.road_data[0][1]]);
	            end_dump = [$scope.x, $scope.road_data[0][1]];
	            dumb_draw = false;
	            dumps_array.push([start_dump, end_dump]);
	            start_dump = [];
	            end_dump = [];
	          }
	        clear_canvas();
	        $scope.x+=4;
	        iterate_dumps();
          iterate_dump_coordinates();
	        iterate_for_drawing();
	    }
	      
	  }

  function iterate_dumps() {
    for(var x=0; x<dumps_array.length; x++) {
      start = dumps_array[x][0];
      end = dumps_array[x][1];
      ctx.beginPath();
      ctx.strokeStyle='black';
      ctx.lineWidth=1;
      ctx.moveTo(start[0]-$scope.offset, start[1]);
      ctx.lineTo(start[0]-$scope.offset, start[1]+150);
      ctx.lineTo(end[0]-$scope.offset,   end[1]+150);
      ctx.lineTo(end[0]-$scope.offset,   end[1]);
      ctx.stroke();

      ctx.font = "13px Arial";
      ctx.fillStyle='black';
      ctx.fillText("DUMP", start[0]-$scope.offset, start[1]+165);
    }
  }

  function iterate_dump_coordinates() {
    for(var x=0; x<dump_coordinats.length; x++) {
      coord = dump_coordinats[x];
      ctx.font = "10px Arial";
      ctx.fillStyle='black';
      ctx.fillText(coord[2], coord[0]-$scope.offset, coord[1]);
    }
  }

    function add_dumb_data() {
      if(dumb_data.length > $scope.x-selected_frame) {
        var data = dumb_data[$scope.x-selected_frame];
        $scope.upload_data({z: data});
      } else {
        clicked = false;
      }
    }

	function clear_canvas() {
	    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	}

	start_animation_loop();

})

.controller('SettingsCtrl', ['$scope', 'settings', '$rootScope', function($scope, settings, $rootScope) {
  $scope.frequency = settings.getFrequency();  
  $scope.deviation = settings.getDiviation();
  $scope.funMode = settings.getFunMode();

  $scope.setFrquency = function(frq) {
    console.log(frq);
    settings.setFrequency(frq);
    $rootScope.$broadcast('options_update');
  }

  $scope.setDiv = function(div) {
    console.log(div);
    settings.setDiviation(div);
    $rootScope.$broadcast('options_update');
  }
  
  $scope.setFunMode = function(funMode) {
    console.log(funMode);
    settings.setFunMode(funMode);
    $rootScope.$broadcast('options_update');
  }

}]);
