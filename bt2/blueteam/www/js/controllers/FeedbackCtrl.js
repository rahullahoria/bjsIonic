/**
 * Created by spider-ninja on 12/12/16.
 */
angular.module('starter.controllers')
    .controller('FeedbackCtrl', function ($scope, $state, $ionicLoading, $ionicHistory, $timeout, $stateParams, $localstorage, $cordovaGeolocation, BlueTeam) {
        $scope.data = {};

        $scope.show = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $timeout(function () {
                $scope.hide();
            }, 5000);

        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };

        $scope.data.name = $localstorage.get('name');
        $scope.data.mobile = parseInt($localstorage.get('mobile'));
        $scope.data.email = "" + $localstorage.get('email');
        $scope.position = {
            "coords": {
                "longitude": null,
                "latitude": null
            }
        };
        // to get current location of the user
        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {

                $scope.position = position;

            }, function (err) {
                // error
                console.log(JSON.stringify(err));
                $scope.position = {
                    "coords": {
                        "longitude": null,
                        "latitude": null
                    }
                };
            });

        $scope.feedback = function () {
            $scope.show();


            BlueTeam.postFeedback({
                    "root": {
                        "name": $scope.data.name,
                        "mobile": "" + $scope.data.mobile,
                        "gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                        "email": $scope.data.email,
                        "feedback": $scope.data.feedback_text
                    }
                })
                .then(function (d) {
                    $scope.hide();
                    $ionicHistory.clearHistory();
                    $state.go('finish');
                    //$scope.services = d['data']['services'];
                });
        };

    })
;