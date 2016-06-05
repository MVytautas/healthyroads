angular.module('starter.controllers', ['ngCordova',
                                        'starter.services',
                                        'openlayers-directive'])

.controller('MapCtrl', function($scope) {
  angular.extend($scope, {
    london: {
        lat: 54.708001,
        lon: 25.270608,
        zoom: 17
    },
    osm: {
        visible: true,
        opacity: 0.5,
        source: {
            type: 'OSM'
        }
    },
    mapbox: {
        visible: true,
        opacity: 0.5,
        source: {
            type: 'TileJSON',
            url: 'http://api.tiles.mapbox.com/v3/mapbox.geography-class.jsonp'
        }
    }
  });
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
          var data_json = {'x': '', 'y':'', 'z':'', 'ts':''};
          // DATA FROM ACCELEROMETER 
          $scope.measurements.x = result.x;
          $scope.measurements.y = result.y;
          $scope.measurements.z = result.z;
          $scope.measurements.timestamp = result.timestamp;

          // Attach data to js obj
          data_json.x = result.x;
          data_json.y = result.y;
          data_json.z = result.z;
          data_json.ts = result.timestamp;

          console.log(JSON.stringify(data_json));
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
          // Broadcast shake detected event
          $rootScope.$broadcast('shake_detected');
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
    var dumb_data = [10.844536781311035,
10.868478775024414,
10.878055572509766,
10.858901977539062,
10.897209167480469,
10.921151161193848,
10.834959983825684,
10.854113578796387,
10.868478775024414,
10.834959983825684,
10.878055572509766,
10.844536781311035,
10.849325180053711,
10.863690376281738,
10.854113578796387,
10.878055572509766,
10.854113578796387,
11.342530250549316,
10.858901977539062,
10.973823547363281,
11.802217483520508,
10.854113578796387,
10.183736801147461,
11.692084312438965,
8.857349395751953,
13.794193267822266,
10.24119758605957,
10.432733535766602,
9.374496459960938,
10.562021255493164,
10.686519622802734,
9.690531730651855,
8.723274230957031,
11.275492668151855,
13.363236427307129,
11.759121894836426,
7.712920665740967,
6.238092422485352,
6.592434406280518,
9.743204116821289,
12.439074516296387,
15.786169052124023,
18.223466873168945,
15.786169052124023,
2.340332269668579,
-4.756081581115723,
5.9986724853515625,
29.97420883178711,
29.050046920776367,
6.04655647277832,
-2.1368250846862793,
-1.0402805805206299,
16.734272003173828,
26.64626693725586,
17.940950393676758,
5.720944881439209,
-1.2030863761901855,
1.5837644338607788,
7.693767070770264,
33.21595764160156,
14.914679527282715,
6.736086368560791,
-6.345831394195557,
0.11372458189725876,
17.414226531982422,
28.437129974365234,
16.901866912841797,
2.8383262157440186,
-2.5773582458496094,
4.231751441955566,
27.766754150390625,
28.489803314208984,
9.503783226013184,
-4.655525207519531,
-2.2373814582824707,
16.293739318847656,
26.536134719848633,
17.08861541748047,
1.334767460823059,
-7.935581684112549,
7.29154109954834,
28.485013961791992,
26.612749099731445,
8.08162784576416,
0.5973533391952515,
0.243011474609375,
20.488380432128906,
29.80182647705078,
12.870031356811523,
-1.212663173675537,
-4.923676013946533,
12.769474983215332,
22.834699630737305,
20.339941024780273,
3.666719913482666,
-2.2421698570251465,
2.718616008758545,
15.561114311218262,
29.56240463256836,
8.9866361618042,
3.3267433643341064,
-0.5374982953071594,
16.710330963134766,
24.19939422607422,
18.055871963500977,
8.943540573120117,
-2.3953988552093506,
4.088099479675293,
16.226701736450195,
26.70372772216797,
16.399084091186523,
1.3634978532791138,
0.32441434264183044,
5.189432144165039,
24.68781089782715,
14.574703216552734,
8.32104778289795,
0.18555063009262085,
1.7944542169570923,
16.01601219177246,
17.28493881225586,
12.654553413391113,
9.48462963104248,
10.193313598632812,
11.433509826660156,
10.676942825317383,
10.667366027832031,
10.854113578796387,
10.667366027832031,
10.710461616516113,
10.834959983825684,
10.767922401428223,
10.878055572509766,
10.571598052978516,
10.743980407714844,
10.992977142333984,
10.911574363708496,
10.763134002685547,
10.676942825317383,
10.882843971252441,
10.83974838256836,
10.897209167480469,
10.791864395141602,
10.834959983825684,
11.040861129760742,
10.605116844177246,
10.811017990112305,
10.887632369995117,
10.959458351135254,
10.787075996398926,
10.743980407714844,
10.925939559936523,
10.90678596496582,
10.72482681274414,
10.758345603942871,
11.079168319702148,
10.90678596496582,
10.499771118164062,
11.69687271118164,
16.93059730529785,
13.741520881652832,
7.583633899688721,
-11.182119369506836,
-1.3227964639663696,
38.20068359375,
11.965023040771484,
 1.4832079410552979,
-6.015431880950928,
 26.51698112487793,
37.83676528930664,
7.583633899688721,
-8.165425300598145,
4.112041473388672,
36.17040252685547,
8.239645004272461,
-15.764620780944824,
39.1727294921875,
9.20211410522461,
-6.135141849517822,
15.89151382446289,
19.832368850708008,
7.483077526092529,
-3.8175547122955322,
23.926454544067383,
18.175582885742188,
8.981847763061523,
10.585963249206543,
10.542867660522461,
11.376049041748047,
10.925939559936523,
10.528501510620117,
11.285069465637207,
10.739192008972168,
11.074379920959473,
10.686519622802734];
    var dump_coordinats = [];
  var dump_refiner = 0;
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
      var z = measurements.z-10;
      var last = $scope.road_data.length-1;
      if($scope.road_data[last][2] != 'added') {
        $scope.road_data.push([$scope.x-2, $scope.first_hit[1]]);
        
        if(z > 7 || z < -7 && dumb_draw == false) {
          start_dump = [$scope.x-2, $scope.first_hit[1]];
          dump_coordinats.push([$scope.x-2, parseInt(z*3)+$scope.first_hit[1], parseInt(z)]);
  	      dumb_draw = true;
  	    } else if (z > 7 || z < -7) {
          dump_coordinats.push([$scope.x-2, parseInt(z*3)+$scope.first_hit[1], parseInt(z)]);
        } else if (dumb_draw == true ) {
          end_dump = [$scope.x-1, parseInt(z*3)+$scope.first_hit[1], 'added'];
          dumps_array.push([start_dump, end_dump]);
          dumb_draw = false;
        }
      }
      $scope.road_data.push([$scope.x-1, parseInt(z*3)+$scope.first_hit[1], 'added']);
      end_dump = [$scope.x-1, parseInt(z*3)+$scope.first_hit[1], 'added'];
      if(z > 7 || z < -7 && dumb_draw == false) {
          start_dump = [$scope.x-2, $scope.first_hit[1]];
          dump_coordinats.push([$scope.x-2, parseInt(z*3)+$scope.first_hit[1], parseInt(z)]);
          dumb_draw = true;
        } else if (z > 7 || z < -7) {
          dump_coordinats.push([$scope.x-2, parseInt(z*3)+$scope.first_hit[1], parseInt(z)]);
        } else if (dumb_draw == true ) {
          end_dump = [$scope.x-1, parseInt(z*3)+$scope.first_hit[1], 'added'];
          dumps_array.push([start_dump, end_dump]);
          dumb_draw = false;
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
          if(last_data[1] == $scope.first_hit[1]) {
            draw(last_data[0], last_data[1], $scope.x, $scope.first_hit[1]);
          }
            } else if($scope.x >= $scope.road_data[x-1][0]) {
              var last_road = $scope.road_data[x-1];
              var road_data = $scope.road_data[x];
              draw(last_road[0], last_road[1], road_data[0], road_data[1]);
            }
          } else {
            var road_data = $scope.first_hit;
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
	        clear_canvas();
	        $scope.x+=4;
	        iterate_dumps();
          iterate_dump_coordinates();
	        iterate_for_drawing();
          clear_arrays();
	    }
	      
	  }


  function clear_arrays() {
    var width = window.innerWidth/2;
    if($scope.road_data.length > width) {
      $scope.road_data.shift();
    }
    if(dumps_array.length > 0 && dumps_array[0][0][0] < $scope.offset) {
      dumps_array.shift();
    }
    if(dump_coordinats.length > 0 && dump_coordinats[0][0] < $scope.offset) {
      dump_coordinats.shift();
    }
    

  }

  function iterate_dumps() {
    for(var x=0; x<dumps_array.length; x++) {
      start = dumps_array[x][0];
      end = dumps_array[x][1];
      ctx.beginPath();
      ctx.strokeStyle='black';
      ctx.lineWidth=1;
      ctx.moveTo(start[0]-$scope.offset, 200);
      ctx.lineTo(end[0]-$scope.offset,   200);
      ctx.stroke();

      ctx.font = "13px Arial";
      ctx.fillStyle='black';
      ctx.fillText("D", start[0]-$scope.offset, start[1]+165);
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
