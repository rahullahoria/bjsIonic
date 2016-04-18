angular.module('starter.services', [])

    .factory('BlueTeam', function($http) {
      // Might use a resource here that returns a JSON array

      var url = "https://blueteam.in/api";
      return {
        getServices: function(type) {
          // $http returns a promise, which has a then function, which also returns a promise
          var promise = $http.get(url+'/services'+(type?type:"")).then(function (response) {
            // The then function here is an opportunity to modify the response
            //console.log(response);
            // The return value gets picked up by the then in the controller.
            return response.data;
          });
          // Return the promise to the controller
          return promise;
        },
        getWork: function(worker_id) {
          // $http returns a promise, which has a then function, which also returns a promise
          var promise = $http.get(url+'/work/'+worker_id+"?current_time="+new Date()).then(function (response) {
            // The then function here is an opportunity to modify the response
            console.log(response);
            // The return value gets picked up by the then in the controller.
            return response.data;
          });
          // Return the promise to the controller
          return promise;
        },
        postWork: function(worker_id, data) {
          // $http returns a promise, which has a then function, which also returns a promise
          console.log(JSON.stringify(data));
          var promise = $http.post(url+'/work/'+worker_id, data ).then(function (response) {
            // The then function here is an opportunity to modify the response
            console.log(response);
            // The return value gets picked up by the then in the controller.
            return response.data;
          });
          // Return the promise to the controller
          return promise;
        },
        calPrice: function(service, data) {
          // $http returns a promise, which has a then function, which also returns a promise
          console.log(JSON.stringify(data));
          var promise = $http.post(url+'/cal-price/'+service, data ).then(function (response) {
            // The then function here is an opportunity to modify the response
            console.log(JSON.stringify(response));
            // The return value gets picked up by the then in the controller.
            return response.data;
          });
          // Return the promise to the controller
          return promise;
        },
        checkMobile: function(mobile) {
          // $http returns a promise, which has a then function, which also returns a promise
          var promise = $http.get(url+'/check-mobile/'+mobile).then(function (response) {
            // The then function here is an opportunity to modify the response
            console.log(response);
            // The return value gets picked up by the then in the controller.
            return response.data;
          });
          // Return the promise to the controller
          return promise;
        },
        getPrice: function(service) {
          // $http returns a promise, which has a then function, which also returns a promise
          var promise = $http.get(url+'/pricings/'+service).then(function (response) {
            // The then function here is an opportunity to modify the response
            console.log(JSON.stringify(response));
            // The return value gets picked up by the then in the controller.
            return response.data;
          });
          // Return the promise to the controller
          return promise;
        },
        getMysr: function(mobile) {
          // $http returns a promise, which has a then function, which also returns a promise
          var promise = $http.get(url+'/mysr/'+mobile).then(function (response) {
            // The then function here is an opportunity to modify the response
            console.log(JSON.stringify(response));
            // The return value gets picked up by the then in the controller.
            return response.data;
          });
          // Return the promise to the controller
          return promise;
        },
        getMysrByCEMId: function(cem_user_id,status) {
          // $http returns a promise, which has a then function, which also returns a promise
          var promise = $http.get(url+'/cem_mysr/'+cem_user_id+'?status='+status).then(function (response) {
            // The then function here is an opportunity to modify the response
            console.log(JSON.stringify(response));
            // The return value gets picked up by the then in the controller.
            return response.data;
          });
          // Return the promise to the controller
          return promise;
        },
        getFaq: function() {
          // $http returns a promise, which has a then function, which also returns a promise
          var promise = $http.get(url+'/FAQ').then(function (response) {
            // The then function here is an opportunity to modify the response
            console.log(JSON.stringify(response));
            // The return value gets picked up by the then in the controller.
            return response.data;
          });
          // Return the promise to the controller
          return promise;
        },

        getTnc: function() {
          // $http returns a promise, which has a then function, which also returns a promise
          var promise = $http.get(url+'/tnc').then(function (response) {
            // The then function here is an opportunity to modify the response
            console.log(JSON.stringify(response));
            // The return value gets picked up by the then in the controller.
            return response.data;
          });
          // Return the promise to the controller
          return promise;
        },

        getScore: function() {
          // $http returns a promise, which has a then function, which also returns a promise
          var promise = $http.get(url+'/get-score').then(function (response) {
            // The then function here is an opportunity to modify the response
            console.log(JSON.stringify(response));
            // The return value gets picked up by the then in the controller.
            return response.data;
          });
          // Return the promise to the controller
          return promise;
        },

        getVerification: function() {
          // $http returns a promise, which has a then function, which also returns a promise
          var promise = $http.get(url+'/verification_process').then(function (response) {
            // The then function here is an opportunity to modify the response
            console.log(JSON.stringify(response));
            // The return value gets picked up by the then in the controller.
            return response.data;
          });
          // Return the promise to the controller
          return promise;
        },

        makeServiceRequest: function(data) {
          // $http returns a promise, which has a then function, which also returns a promise
          console.log(JSON.stringify(data));
          var promise = $http.post(url+'/service_request', data ).then(function (response) {
            // The then function here is an opportunity to modify the response
            console.log(JSON.stringify(response));
            // The return value gets picked up by the then in the controller.
            return response.data;
          });
          // Return the promise to the controller
          return promise;
        },
        postWorker: function(data) {
          // $http returns a promise, which has a then function, which also returns a promise
          console.log(JSON.stringify(data));
          var promise = $http.post(url+'/workers/addNew', data ).then(function (response) {
            // The then function here is an opportunity to modify the response
            console.log(JSON.stringify(response));
            // The return value gets picked up by the then in the controller.
            return response.data;
          });
          // Return the promise to the controller
          return promise;
        },
        updateSR: function(sr_id, data) {
          // $http returns a promise, which has a then function, which also returns a promise
          console.log("request set by ", sr_id, JSON.stringify(data));
          var promise = $http.post(url+'/service_request/sr_id', data ).then(function (response) {
            // The then function here is an opportunity to modify the response
            console.log(JSON.stringify(response));
            // The return value gets picked up by the then in the controller.
            return response.data;
          });
          // Return the promise to the controller
          return promise;
        },
        updateRating: function(data) {
          // $http returns a promise, which has a then function, which also returns a promise
          console.log(JSON.stringify(data));
          var promise = $http.post(url+'/ratings', data ).then(function (response) {
            // The then function here is an opportunity to modify the response
            console.log(response);
            // The return value gets picked up by the then in the controller.
            return response.data;
          });
          // Return the promise to the controller
          return promise;
        },
        makePayment: function(data) {
          // $http returns a promise, which has a then function, which also returns a promise
          console.log(JSON.stringify(data));
          var promise = $http.post(url+'/payment', data ).then(function (response) {
            // The then function here is an opportunity to modify the response
            console.log(response);
            // The return value gets picked up by the then in the controller.
            return response.data;
          });
          // Return the promise to the controller
          return promise;
        },
        postFeedback: function(data) {
          // $http returns a promise, which has a then function, which also returns a promise
          console.log(JSON.stringify(data));
          var promise = $http.post(url+'/feedback', data ).then(function (response) {
            // The then function here is an opportunity to modify the response
            console.log(response);
            // The return value gets picked up by the then in the controller.
            return response.data;
          });
          // Return the promise to the controller
          return promise;
        },
        postRaw: function(data, type) {
          // $http returns a promise, which has a then function, which also returns a promise
          console.log(JSON.stringify(data));
          var promise = $http.post(url+'/raw?type='+type, data ).then(function (response) {
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

          console.log(JSON.stringify(data));
          var promise = $http.post(url+'/client', data ).then(function (response) {
            // The then function here is an opportunity to modify the response
            console.log(response);
            // The return value gets picked up by the then in the controller.
            return response.data;
          });
          // Return the promise to the controller
          return promise;
        },
        loginUser: function(data) {
          // $http returns a promise, which has a then function, which also returns a promise

          console.log(JSON.stringify(data));
          var promise = $http.post(url+'/login', data ).then(function (response) {
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

    .factory('CallLogService', ['$q', function($q) {
      return {

        list : function(days) {
          var q = $q.defer();
          // days is how many days back to go
          window.plugins.calllog.list(days, function (response) {
            q.resolve(response.rows);
          }, function (error) {
            q.reject(error)
          });
          return q.promise;
        },

        contact : function(phoneNumber) {
          var q = $q.defer();
          window.plugins.calllog.contact(phoneNumber, function (response) {
            q.resolve(response);
          }, function (error) {
            q.reject(error)
          });
          return q.promise;
        },

        show : function(phoneNumber) {
          var q = $q.defer();
          window.plugins.calllog.show(phoneNumber, function (response) {
            q.resolve(response);
          }, function (error) {
            q.reject(error)
          });
          return q.promise;
        },

        delete : function(phoneNumber) {
          var q = $q.defer();
          window.plugins.calllog.delete(id, function (response) {
            q.resolve(response);
          }, function (error) {
            q.reject(error)
          });
          return q.promise;
        }
      }
    }])

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
    }])

    .factory('Contactlist', function() {
      return {
        getAllContacts: function() {
          return [
            { name: 'Contact 1' },
            { name: 'Contact 2' },
            { name: 'Contact 3'},
            { name: 'Contact 4'}
          ];
        }
      };
    });