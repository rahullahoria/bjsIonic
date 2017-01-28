/**
 * Created by spider-ninja on 12/12/16.
 */
angular.module('starter.controllers')
    .controller('ServiceRequestCtrl', function ($scope, $state, $ionicPopup, $cordovaGeolocation, $ionicHistory, $timeout, $stateParams, $localstorage, BlueTeam) {

        $scope.user_id = $localstorage.get('user_id');
        $scope.data = {};
        $scope.data.name = $localstorage.get('name');
        $scope.data.mobile = parseInt($localstorage.get('mobile'));
        $scope.data.email = "" + $localstorage.get('email');

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

        BlueTeam.getMysr($localstorage.get('mobile'))
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

        $scope.updateRating = function ($user_id, $rating) {
            BlueTeam.updateRating({
                    "root": {
                        "customer_id": $scope.user_id,
                        "user_id": $user_id,
                        "rating": "" + $rating/*,
                         "device_id": $cordovaDevice.getUUID()*/
                    }
                })
                .then(function (d) {
                    //$scope.services = d['data']['services'];
                    $scope.doRefresh();
                });
        };
        $scope.doRefresh = function () {
            BlueTeam.getMysr($localstorage.get('mobile'))
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

        $scope.data.feedback_text = null;


        // An elaborate, custom popup
        $scope.inform = function () {
            var sendInfoPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="data.feedback_text"/>',
                title: 'Please Type what you inform about?',
                subTitle: 'You can inform here about the worker holiday or anything you want to communicate to BlueTeam.',
                scope: $scope,
                buttons: [
                    {text: 'Cancel'},
                    {
                        text: '<b>Send</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$scope.data.feedback_text) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();

                            } else {

                                return $scope.data.feedback_text;
                            }
                        }
                    }
                ]
            });

            sendInfoPopup.then(function (res) {
                console.log("tep", res);
                if (res) {
                    $scope.feedback();
                }
            });
        };

        $scope.feedback = function () {
            //$scope.show();


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
                    //$scope.hide();
                    //$ionicHistory.clearHistory();
                    //$state.go('finish');
                    //$scope.services = d['data']['services'];
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