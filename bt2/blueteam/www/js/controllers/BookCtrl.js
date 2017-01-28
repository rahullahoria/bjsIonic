/**
 * Created by spider-ninja on 12/12/16.
 */
angular.module('starter.controllers')
    .controller('BookCtrl', function ($scope, $state, $ionicLoading, $timeout, $ionicHistory, $stateParams,
                                      $cordovaGeolocation, $localstorage, $cordovaDevice, BlueTeam) {
        //for datetime picker
        console.log("start book ctrl");
        $scope.datetimeValue = new Date();
        $scope.datetimeValue.setHours(7);
        $scope.datetimeValue.setMinutes(0);

        $scope.type = $localstorage.get('type');
        if ($scope.type != "customer")
            $scope.notCustomer = true;

        $scope.data = {};
        $scope.data.hours = 2;

        $scope.v = {};
        $scope.v.mobile = false;
        $scope.v.name = false;
        $scope.v.hours = false;
        $scope.v.address = false;

        $scope.valIP = function(){


            if($scope.data.mobile  != undefined){
                $scope.v.mobile = $scope.goLogin = true;
            }else
                $scope.v.mobile = $scope.goLogin = false;

            if($scope.data.name  != undefined){
                $scope.v.name = $scope.goReg = true;
            }else
                $scope.v.name = $scope.goReg = false;

            if($scope.data.hours  != undefined){
                $scope.v.hours = $scope.goReg = true;
            }else
                $scope.v.hours = $scope.goReg = false;

            if($scope.data.address  != undefined){
                $scope.v.address = $scope.goReg = true;
            }else
                $scope.v.address = $scope.goReg = false;

            if($scope.data.startTimeSet && $scope.type == 'Monthly'){
                $scope.show();
                BlueTeam.calPrice($scope.serviceName.toLowerCase(),
                    {
                        "root": {
                            "days": 30,
                            "startHr": $scope.data.drv.getHours(),
                            "selectedTime": $scope.data.startTime,
                            "hours": $scope.data.hours
                        }
                    }
                    )
                    .then(function (d) {
                        $scope.hide();
                        $scope.resp = d['root'];

                        console.log($scope.resp);


                        $scope.max = $scope.resp.max;

                        $scope.min = ($scope.resp.min == 0)?$scope.resp.max:$scope.resp.min;

                        $scope.data.days = $scope.resp.days;
                        $scope.forDays = $scope.resp.forDays;


                        //<strike>
                        $scope.discount = $scope.resp.discount;
                        $scope.avg = $scope.resp.avg;

                        console.log("max", $scope.max, $scope.min, $scope.avg, $scope.forDays);
                    });
            }


        };

        /*if (window.services === undefined)
            $state.go('tab.service-list');

        for (i = 0; i < window.services.length; i++) {

            if (window.services[i].name == $stateParams.name) {

                for (j = 0; j < window.services[i].plans.length; j++) {

                    if (window.services[i].plans[j].name == $stateParams.type) {

                        $scope.price = window.services[i].plans[j].price;
                    }
                }
            }
        }*/


        $scope.serviceId = $stateParams.id;
        $scope.serviceName = $stateParams.name;
        $scope.type = $stateParams.type;
        $scope.serviceProviderId = $stateParams.serviceProviderId;
        window.service_type = $scope.type;
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

        $scope.data.startTimeSet = false;

        $scope.takeStartTime = function () {
            console.log($scope.datetimeValue.toString(), $scope.data.drv.toString());
            $scope.data.startTime = "" + ("0" + ($scope.data.drv.getHours())).slice(-2)
                + ":" + ("0" + ($scope.data.drv.getMinutes())).slice(-2) + ":00";
            $scope.data.endTime = "" + ("0" + ($scope.data.drv.getHours() + parseInt($scope.data.hours)) % 24 ).slice(-2)
                + ":" + ("0" + ($scope.data.drv.getMinutes())).slice(-2) + ":00";
            $scope.data.startTimeSet = true;
            $scope.valIP();
        };
        // making post api call to the server by using angular based service

        $scope.conf = function () {
            if (!$scope.data.startTimeSet) {
                return false;
            }


            $scope.show();
            //$localstorage.set('name', $scope.data.name);
            //$localstorage.set('mobile', $scope.data.mobile);
            $localstorage.set('address', $scope.data.address);
            console.log(JSON.stringify($scope.position));
            BlueTeam.makeServiceRequest({
                    "root": {
                        "name": $scope.data.name,
                        "mobile": "" + $scope.data.mobile,
                        "location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                        "requirements": $scope.serviceName,
                        "service_id": $scope.serviceId,
                        "user_id": $localstorage.get('user_id'),
                        "user_type": $localstorage.get('type'),
                        "start_datatime": $scope.data.drv + "",
                        "service_type": $scope.type,
                        "service_provider_id": $scope.serviceProviderId,
                        "remarks": $scope.type + " by mobile app," + $scope.data.remark,
                        "start_time": $scope.data.startTime,
                        "end_time": $scope.data.endTime,
                        "address": $scope.data.address,
                        "remark": $scope.data.remark,
                        "priority": "" + 3,
                        "device_id": $cordovaDevice.getUUID()
                    }
                })
                .then(function (d) {
                    $scope.hide();
                    $ionicHistory.clearHistory();
                    $state.go('finish');
                    //$scope.services = d['data']['services'];
                });
        };

        $scope.valIP();

    });