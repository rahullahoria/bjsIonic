/**
 * Created by spider-ninja on 12/12/16.
 */
angular.module('starter.services', [])

    .factory('BlueTeam', function ($http) {
        // Might use a resource here that returns a JSON array

        var url = "https://blueteam.in/api";
        return {
            getServices: function (type) {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get(url + '/services' + (type ? type : "")).then(function (response) {
                    // The then function here is an opportunity to modify the response
                    //console.log(response);
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },
            getWork: function (worker_id) {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get(url + '/work/' + worker_id + "?current_time=" + new Date()).then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(response);
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },
            getUserById: function (id) {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get(url + '/workers/' + id ).then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(JSON.stringify(response));
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },
            getRefWorkers: function (user_id) {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get(url + '/workers?user_id=' + user_id ).then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(JSON.stringify(response));
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },
            postWork: function (worker_id, data) {
                // $http returns a promise, which has a then function, which also returns a promise
                console.log(JSON.stringify(data));
                var promise = $http.post(url + '/work/' + worker_id, data).then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(response);
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },
            calPrice: function (service, data) {
                // $http returns a promise, which has a then function, which also returns a promise
                console.log(JSON.stringify(data));
                var promise = $http.post(url + '/cal-price/' + service, data).then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(JSON.stringify(response));
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },
            checkMobile: function (mobile) {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get(url + '/check-mobile/' + mobile).then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(response);
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },
            getPrice: function (service) {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get(url + '/pricings/' + service).then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(JSON.stringify(response));
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },
            getMysr: function (mobile) {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get(url + '/mysr/' + mobile).then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(JSON.stringify(response));
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },
            getMysrByCEMId: function (cem_user_id, status) {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get(url + '/cem_mysr/' + cem_user_id + '?status=' + status).then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(JSON.stringify(response));
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },
            getFaq: function () {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get(url + '/FAQ').then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(JSON.stringify(response));
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },

            getTnc: function () {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get(url + '/tnc').then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(JSON.stringify(response));
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },

            getScore: function () {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get(url + '/get-score').then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(JSON.stringify(response));
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },

            getVerification: function () {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get(url + '/verification_process').then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(JSON.stringify(response));
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },

            makeServiceRequest: function (data) {
                // $http returns a promise, which has a then function, which also returns a promise
                console.log(JSON.stringify(data));
                var promise = $http.post(url + '/service_request', data).then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(JSON.stringify(response));
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },

            meetingRequest: function (data) {
                // $http returns a promise, which has a then function, which also returns a promise
                console.log(JSON.stringify(data));
                var promise = $http.post(url + '/meetings', data).then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(JSON.stringify(response));
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },

            postWorker: function (data) {
                // $http returns a promise, which has a then function, which also returns a promise
                console.log(JSON.stringify(data));
                var promise = $http.post(url + '/workers/addNew', data).then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(JSON.stringify(response));
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },
            updateSR: function (sr_id, data) {
                // $http returns a promise, which has a then function, which also returns a promise
                console.log("request set by ", sr_id, JSON.stringify(data));
                var promise = $http.post(url + '/service_request/sr_id', data).then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(JSON.stringify(response));
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },
            updateRating: function (data) {
                // $http returns a promise, which has a then function, which also returns a promise
                console.log(JSON.stringify(data));
                var promise = $http.post(url + '/ratings', data).then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(response);
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },
            makePayment: function (data) {
                // $http returns a promise, which has a then function, which also returns a promise
                console.log(JSON.stringify(data));
                var promise = $http.post(url + '/payment', data).then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(response);
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },
            postFeedback: function (data) {
                // $http returns a promise, which has a then function, which also returns a promise
                console.log(JSON.stringify(data));
                var promise = $http.post(url + '/feedback', data).then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(response);
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },
            postRaw: function (data, type) {
                // $http returns a promise, which has a then function, which also returns a promise
                console.log(JSON.stringify(data));
                var promise = $http.post(url + '/raw?type=' + type, data).then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(response);
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },
            regUser: function (data) {
                // $http returns a promise, which has a then function, which also returns a promise

                console.log(JSON.stringify(data));
                var promise = $http.post(url + '/client', data).then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(response);
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },
            loginUser: function (data) {
                // $http returns a promise, which has a then function, which also returns a promise

                console.log(JSON.stringify(data));
                var promise = $http.post(url + '/login', data).then(function (response) {
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




;
