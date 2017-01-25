/**
 * Created by spider-ninja on 11/27/16.
 */
angular.module('starter.controllers')

    .controller('ExpanseCtrl', function ($scope, $state, $ionicLoading, $timeout, $ionicHistory, $stateParams,
                                         $cordovaGeolocation, $localstorage, $cordovaDevice, $cordovaToast, BlueTeam) {
        //for datetime picker
        console.log("start book ctrl");
        $scope.data = {};

        if ($localstorage.get('user_id') === undefined || $localstorage.get('user_id') === "") {
            $ionicHistory.clearHistory();
            $state.go('reg');
            return;
        }

        console.log($localstorage.get('user'));
        $scope.user = JSON.parse($localstorage.get('user'));
        $scope.user_id = $localstorage.get('user_id');
        $scope.services = JSON.parse($localstorage.get('services'));

        console.log($localstorage.get('services'));

        $scope.data.service_id = $scope.services[0].id;

        $scope.position = {
            "coords": {
                "longitude": null,
                "latitude": null
            }
        };

        $scope.v = {};
        $scope.v.mobile = false;
        $scope.v.name = false;
        $scope.v.type = false;
        $scope.v.amount = false;

        $scope.v.addExpense = false;
        $scope.valIP = function(){


            if($scope.data.mobile  != undefined){
                $scope.v.mobile = $scope.v.addExpense = true;
            }else
                $scope.v.mobile = $scope.v.addExpensen = false;
            if($scope.data.name  != undefined){
                $scope.v.name = $scope.v.addExpense = true;
            }else
                $scope.v.name = $scope.v.addExpensen = false;
            if($scope.data.type  != undefined){
                $scope.v.type = $scope.v.addExpense = true;
            }else
                $scope.v.type = $scope.v.addExpensen = false;
            if($scope.data.amount  != undefined){
                $scope.v.amount = $scope.v.addExpense = true;
            }else
                $scope.v.amount = $scope.v.addExpense = false;


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

        // making post api call to the server by using angular based service

        $scope.expanseTypes = [];
        BlueTeam.getExpanseTypes($scope.user_id)
            .then(function (d) {
               $scope.expanseTypes = d['expanse_types'];
            });

        $scope.data.service_tax = true;
        $scope.conf = function () {


            $scope.show();

            console.log(JSON.stringify($scope.position));
            BlueTeam.sendExpanse($scope.user_id, {

                    "receiver_name": $scope.data.name,
                    "send_expanse": $scope.data.send_expanse,
                    "receiver_mobile": "" + $scope.data.mobile,
                    "location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                    "user_id": $localstorage.get('user_id'),
                    "type": $scope.data.type,
                    "amount": $scope.data.amount,
                    "device_id": $cordovaDevice.getUUID()

                })
                .then(function (d) {
                    $scope.hide();
                    $scope.data = {};
                    var temp = ($scope.data.send_expanse)?'Sent':'Added';
                    $cordovaToast.showLongBottom('Expanse '+temp+', Successfully').then(function (success) {
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