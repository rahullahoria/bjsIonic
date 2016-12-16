angular.module('starter.controllers', ['ionic', 'ngCordova', 'ionic-timepicker', 'ion-datetime-picker', 'ionic.rating'])


    .controller('ServiceTypeCtrl', function ($scope, $state, $stateParams,BlueTeam) {


        if (window.services === undefined)
            $state.go('tab.service-list');

        for (i = 0; i < window.services.length; i++) {
            if (window.services[i].name == $stateParams.id) {
                $scope.plans = window.services[i].plans;
            }
        }

        var temp = BlueTeam.getServiceProviders($stateParams.id).then(function (d) {

            //$ionicHistory.clearHistory();
            $scope.serviceProviders = d.service_providers;
            console.log(JSON.stringify($scope.serviceProviders));
            //$scope.hide();
        });

        $scope.service = $stateParams.id;

    })

    .controller('FinishCtrl', function ($scope, $state, $window, $ionicHistory, $timeout, $stateParams, $ionicLoading, $timeout,
                                        $localstorage, $cordovaDevice, BlueTeam) {
        //hi, I am Vikas Nagar. I got assigned as your CEM (Client Engagement Manager).
        // I need to make sure you don't face any problem in process of taking service from BlueTeam.
        // I want to meet regarding this Service Request, which you have just given.
        // Please give me a meeting time in form bellow. So that I can make sure you don't face any problem:

        // Lets Meet.
        $scope.data = {};

        $scope.datetimeValue = new Date();
        $scope.datetimeValue.setHours(7);
        $scope.datetimeValue.setMinutes(0);

        $scope.data.name = $localstorage.get('name');
        $scope.data.mobile = parseInt($localstorage.get('mobile'));
        $scope.data.address = $localstorage.get('address');
        $scope.data.cem_id = 3;

        if(window.service_type == 'Monthly') {
            $scope.data.meeting = false;
            $scope.waitTime = 3000;
        }
        else {
            $scope.data.meeting = true;
            $scope.waitTime = 8000;
        }

        $scope.show = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $timeout(function () {
                $scope.hide();
            }, 5000);

        };

        $scope.takeStartTime = function () {
            console.log($scope.datetimeValue.toString(), $scope.data.drv.toString());
            $scope.data.startTimeSet = true;
        };

        $scope.hide = function () {
            $ionicLoading.hide();
        };

        $scope.meeting = function () {
            if (!$scope.data.startTimeSet) {
                $scope.error = true;
                return false;
            }

            $scope.show();

            BlueTeam.meetingRequest({
                    "root": {
                        "name": $scope.data.name,
                        "mobile": "" + $scope.data.mobile,
                        "user_id": $localstorage.get('user_id'),
                        "user_type": $localstorage.get('type'),
                        "data_time": $scope.data.drv + "",
                        "address": $scope.data.address,
                        "cem_id": $scope.data.cem_id,
                        "device_id": $cordovaDevice.getUUID()
                    }
                })
                .then(function (d) {
                    $scope.hide();
                    $ionicHistory.clearHistory();
                    window.service_type == '';
                    $timeout(function () {
                        $window.location.reload(true);
                    }, 1000);
                    //$scope.services = d['data']['services'];
                });

        };


        $scope.$on('$ionicView.enter', function () {
            // Code you want executed every time view is opened
            if($scope.data.meeting) {
                $ionicHistory.clearHistory();
                $timeout(function () {
                    $state.go('tab.service-list');
                }, $scope.waitTime)
            }
        })

    })

    .controller('AboutCtrl', function ($scope, $state, $ionicHistory, $timeout, $stateParams) {


    })

    .controller('F&QCtrl', function ($scope, $state, $ionicLoading, $ionicHistory, $timeout, $stateParams, BlueTeam) {

        $scope.items = null;

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

        $scope.show();

        BlueTeam.getFaq()
            .then(function (d) {

                //$scope.hide();
                //$ionicHistory.clearHistory();
                //$state.go('finish');
                $scope.hide();
                $scope.items = d['root']['faqs'];
            });

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
    .controller('ContactUsCtrl', function ($scope, $state, $ionicHistory, $timeout, $stateParams, BlueTeam) {


    })



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
        $scope.data.hours = "";

        if (window.services === undefined)
            $state.go('tab.service-list');

        for (i = 0; i < window.services.length; i++) {

            if (window.services[i].name == $stateParams.id) {

                for (j = 0; j < window.services[i].plans.length; j++) {

                    if (window.services[i].plans[j].name == $stateParams.type) {

                        $scope.price = window.services[i].plans[j].price;
                    }
                }
            }
        }


        $scope.service = $stateParams.id;
        $scope.type = $stateParams.type;
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
            $scope.data.startTimeSet = true;
        };
        // making post api call to the server by using angular based service

        $scope.conf = function () {
            if (!$scope.data.startTimeSet) {
                return false;
            }
            $scope.data.startTime = "" + ("0" + ($scope.data.drv.getHours())).slice(-2)
                + ":" + ("0" + ($scope.data.drv.getMinutes())).slice(-2) + ":00";
            $scope.data.endTime = "" + ("0" + ($scope.data.drv.getHours() + parseInt($scope.data.hours)) % 24 ).slice(-2)
                + ":" + ("0" + ($scope.data.drv.getMinutes())).slice(-2) + ":00";

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
                        "requirements": $scope.service,
                        "user_id": $localstorage.get('user_id'),
                        "user_type": $localstorage.get('type'),
                        "start_datatime": $scope.data.drv + "",
                        "service_type": $scope.type,
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

    });