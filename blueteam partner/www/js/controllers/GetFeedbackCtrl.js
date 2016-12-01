/**
 * Created by spider-ninja on 11/27/16.
 */
angular.module('starter.controllers')


    .controller('GetFeedbackCtrl', function ($scope, $state, $ionicLoading, $timeout, $ionicHistory, $stateParams,
                                             $cordovaGeolocation, $localstorage, $cordovaDevice, $cordovaToast, BlueTeam) {
        //for datetime picker
        console.log("start get feedback ctrl");

        if ($localstorage.get('user_id') === undefined || $localstorage.get('user_id') === "") {
            $ionicHistory.clearHistory();
            $state.go('reg');
            return;
        }

        console.log($localstorage.get('user'));
        $scope.user = JSON.parse($localstorage.get('user'));
        $scope.user_id = $localstorage.get('user_id');
        $scope.services = JSON.parse($localstorage.get('services'));

        $scope.data = {};

        $scope.data.name = $localstorage.get('name');
        $scope.data.mobile = parseInt($localstorage.get('mobile'));
        $scope.data.address = $localstorage.get('address');
        $scope.position = {
            "coords": {
                "longitude": null,
                "latitude": null
            }
        };
        // to get current location of the user
        var posOptions = {
            timeout: 1000,
            enableHighAccuracy: false
        };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {

                $scope.position = position;
                console.log(JSON.stringify(position))

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


        $scope.feedbackInvitation = function () {


            $scope.show();

            console.log(JSON.stringify($scope.position));
            BlueTeam.feedbackRequest($scope.user_id, {

                    "customer_name": $scope.data.name,
                    "customer_mobile": "" + $scope.data.mobile,
                    "location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                    "service_id": $scope.data.service_id,
                    "user_id": $localstorage.get('user_id'),
                    "user_type": $localstorage.get('type'),
                    "device_id": $cordovaDevice.getUUID()

                })
                .then(function (d) {

                    $scope.hide();
                    $scope.data = {};
                    $cordovaToast.showLongBottom('Request for Feedback Sent, Successfully').then(function (success) {
                        // success
                    }, function (error) {
                        // error
                    });
                    $ionicHistory.clearHistory();
                    $state.go('tab.service-list');
                    //$scope.services = d['data']['services'];
                });
        };

    });