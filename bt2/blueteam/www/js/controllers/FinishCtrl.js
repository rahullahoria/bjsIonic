/**
 * Created by spider-ninja on 12/12/16.
 */
angular.module('starter.controllers')
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

    });