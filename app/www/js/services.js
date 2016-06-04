angular.module('starter.services', [])

.factory('data_processor',['$rootScope', function($rootScope) {
  var data = [];

  // Event listener exaple
  // $rootScope.$on('data_processor:data_in', function(evt) {      
  // });

  $rootScope.$broadcast('eventFired', {
                data: 'something'
            });

  return {
    //return $resource('/:myFile.json', {myFile: '@file'});
    add_data : function(dt) {
      // TODO serilize data to JSON
      data.append(dt);
      $rootScope.broadcast('data_processor:data_in');
    }, 
    get_data : function() {
      return data;
    }
  };
}])

.factory('settings', ['$rootScope', function($rootScope) {
  // Frequency default 100
  var frequency = 100;
  var options = { 
      frequency: 100, // Measure every 100ms
      deviation : 25  // We'll use deviation to determine the shake event, best values in the range between 25 and 30
  };
  return {
    setFrequncy : function(frqncy) {
      options.frequency = frqncy;
      $rootScope.broadcast('settings:frequency_changed');
    },
    getFrequncy : function() {
      return options.frequency;
    }, 
    getOptions : function() {
      return options;
    },
    setDeviation : function(dev) {
      options.deviation = dev;
    },
    getDiviation : function() {
      return options.deviation;
    } 
  };
}]);
