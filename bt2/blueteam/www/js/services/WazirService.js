/**
 * Created by spider-ninja on 12/12/16.
 */
/**
 * Created by spider-ninja on 12/12/16.
 */
angular.module('starter.services', [])

    .factory('Wazir', function ($http) {
        // Might use a resource here that returns a JSON array

        var urlWazir = "https://blueteam.in/wazir_api";
        return {
            getServiceProviderScore: function (id) {
                var promise = $http.get(urlWazir + '/feedbacks/1/bt-sp-'+id+'/count').then(function (response) {

                    console.log(JSON.stringify(response));

                    return response.data;
                });

                return promise;
            }
        };
    });




;
