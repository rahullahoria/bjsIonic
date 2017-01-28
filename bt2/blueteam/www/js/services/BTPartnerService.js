/**
 * Created by spider-ninja on 12/12/16.
 */
/**
 * Created by spider-ninja on 12/12/16.
 */
angular.module('starter.services', [])

    .factory('BTPartner', function ($http) {
        // Might use a resource here that returns a JSON array

        var urlSP = "https://blueteam.in/sp_api";
        return {

            getServiceProviderServices: function () {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get(urlSP+'/services?category=true').then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(JSON.stringify(response));
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },

            getHotServices: function () {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get(urlSP+'/services?type=hot').then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(JSON.stringify(response));
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },

            getServiceProviders: function (id) {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get(urlSP+'/service/'+ id).then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(JSON.stringify(response));
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },

            search: function (keywords) {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get(urlSP+'/search/'+ keywords).then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(JSON.stringify(response));
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            }

        };
    })




;
