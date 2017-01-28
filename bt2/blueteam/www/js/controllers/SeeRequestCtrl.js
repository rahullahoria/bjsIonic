/**
 * Created by spider-ninja on 12/12/16.
 */
angular.module('starter.controllers')
    .controller('SeeRequestCtrl', function ($scope, $state, $window, $cordovaGeolocation, $cordovaDevice,
                                            $ionicLoading, $timeout, $ionicPopup, $ionicHistory, $timeout, $stateParams, $localstorage, BlueTeam) {

        $scope.data = {};
        $scope.user_id = $localstorage.get('user_id');
        $scope.data.status = "open";


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


        BlueTeam.getMysrByCEMId($scope.user_id, $scope.data.status)
            .then(function (d) {

                //$scope.hide();
                //$ionicHistory.clearHistory();
                //$state.go('finish');
                $scope.srs = d['root']['srs'];
                console.log(JSON.stringify($scope.srs));
            });

        // set the rate and max variables
        $scope.rating = {};

        $scope.rating.max = 5;

        $scope.update = function (key, value, sr_id, index) {
            var updateConfirmPopup = $ionicPopup.confirm({
                title: 'Confirm Update',
                template: 'Are you sure to Update?'
            });

            updateConfirmPopup.then(function (res) {
                if (res) {
                    console.log('You are sure');
                    //setObject

                    $scope.show();

                    BlueTeam.updateSR(sr_id, {
                            "root": {
                                "sr_id": sr_id,
                                "user_id": $localstorage.get('user_id'),
                                "gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                                "key": key,
                                "value": value,
                                "device_id": $cordovaDevice.getUUID()
                            }
                        })
                        .then(function (d) {
                            $scope.srs[index].dontshow = true;
                            /*$timeout(function () {
                             $window.location.reload(true);
                             }, 10000);*/
                            //$scope.work.log_id = d['root'].id;

                        });

                } else {
                    console.log('You are not sure');
                }
            });


        };

        $scope.doRefresh = function () {
            BlueTeam.getMysrByCEMId($scope.user_id, $scope.data.status)
                .then(function (d) {

                    //$scope.hide();
                    //$ionicHistory.clearHistory();
                    //$state.go('finish');
                    $scope.srs = d['root']['srs'];

                    console.log(JSON.stringify($scope.srs));
                })
                .finally(function () {
                    // Stop the ion-refresher from spinning
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };

        $scope.toggleItem = function (item) {
            if ($scope.isItemShown(item)) {
                $scope.shownItem = null;
            } else {
                $scope.shownItem = item;
            }
        };
        $scope.isItemShown = function (item) {
            return $scope.shownItem === item;
        };

    })
;