angular.module('starter.services', [])

.factory('data_processor',['$rootScope', function($rootScope) {
  var data = [];

  // Event listener exaple
  // $rootScope.$on('data_processor:data_in', function(evt) {      
  // });
  return {
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
  return {
    setFrequncy : function(frqncy) {
      frequency = frqncy;
      $rootScope.broadcast('settings:frequency_changed');
    },
    getFrequncy : function() {

    }
  };
}]);


