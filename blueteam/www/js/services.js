angular.module('starter.services', [])

.factory('BlueTeam', function($http) {
  // Might use a resource here that returns a JSON array


  return {
    getServices: function() {
      // $http returns a promise, which has a then function, which also returns a promise
      var promise = $http.get('http://api.blueteam.in/v0/services').then(function (response) {
        // The then function here is an opportunity to modify the response
        console.log(response);
        // The return value gets picked up by the then in the controller.
        return response.data;
      });
      // Return the promise to the controller
      return promise;
    },
    makeServiceRequest: function(data) {
      // $http returns a promise, which has a then function, which also returns a promise
      var promise = $http.post('http://api.blueteam.in/v0/service_request', data ).then(function (response) {
        // The then function here is an opportunity to modify the response
        console.log(response);
        // The return value gets picked up by the then in the controller.
        return response.data;
      });
      // Return the promise to the controller
      return promise;
    },
    regUser: function(data) {
      // $http returns a promise, which has a then function, which also returns a promise
      var promise = $http.post('http://api.blueteam.in/v0/user', data ).then(function (response) {
        // The then function here is an opportunity to modify the response
        console.log(response);
        // The return value gets picked up by the then in the controller.
        return response.data;
      });
      // Return the promise to the controller
      return promise;
    }
  };
})
.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);
