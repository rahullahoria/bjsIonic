/**
 * Created by spider-ninja on 11/27/16.
 */
angular.module('starter.controllers')

    .controller('InvoiceCtrl', function ($scope, $state, $ionicLoading, $timeout, $ionicHistory, $stateParams,
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

        $scope.data.service_tax = true;
        $scope.conf = function () {


            $scope.show();

            console.log(JSON.stringify($scope.position));
            BlueTeam.sendInvoice($scope.user_id, {

                    "customer_name": $scope.data.name,
                    "send_bill": $scope.data.send_bill,
                    "customer_mobile": "" + $scope.data.mobile,
                    "location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                    "service_id": $scope.data.service_id,
                    "user_id": $localstorage.get('user_id'),
                    "user_type": $localstorage.get('type'),
                    "amount": $scope.data.amount,
                    "service_tax": "yes",
                    "device_id": $cordovaDevice.getUUID()

                })
                .then(function (d) {
                    $scope.hide();
                    $scope.data = {};
                    var temp = ($scope.data.send_bill)?'Sent':'Added';
                    $cordovaToast.showLongBottom('Bill '+temp+', Successfully').then(function (success) {
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