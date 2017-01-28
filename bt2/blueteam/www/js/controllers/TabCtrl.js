/**
 * Created by spider-ninja on 12/12/16.
 */
angular.module('starter.controllers')
    .controller('TabCtrl', function ($scope, $state, $ionicPopup, $cordovaSocialSharing, $ionicPlatform, $ionicModal, $timeout, $ionicHistory, $cordovaToast, $localstorage) {

        $scope.count = 0;
        $ionicPlatform.registerBackButtonAction(function (event) {
            if ($state.current.name == "tab.service-list") {
                $cordovaToast.showLongBottom('Press 2 more time to exit').then(function (success) {
                    // success
                }, function (error) {
                    // error
                });

                $scope.count++;
                if ($scope.count >= 3)
                    navigator.app.exitApp();
            }

            if ($state.current.name == "reg") {
                $cordovaToast.showLongBottom('Press 2 more time to exit').then(function (success) {
                    // success
                }, function (error) {
                    // error
                });

                $scope.count++;
                if ($scope.count >= 3)
                    navigator.app.exitApp();
            }
            else {
                navigator.app.backHistory();
            }
        }, 100);


        $scope.type = $localstorage.get('type');
        $scope.name = $localstorage.get('name');

        $scope.customer = true;
        if ($scope.type == "cem") {
            $scope.cem = true;
            $scope.customer = false;
        }

        if ($scope.type != "customer")
            $scope.customer = false;

        $scope.logout = function () {
            var logoutConfirmPopup = $ionicPopup.confirm({
                title: 'Confirm Logout',
                template: 'Are you sure to LogOut?'
            });

            logoutConfirmPopup.then(function (res) {
                if (res) {
                    console.log('You are sure');
                    //setObject
                    $localstorage.set('name', "");
                    $localstorage.set('mobile', "");
                    $localstorage.set('email', "");
                    $localstorage.set('type', "");
                    $localstorage.set('user_id', "");

                    $timeout(function () {
                        $ionicHistory.clearCache();
                        $ionicHistory.clearHistory();


                    }, 100);
                    $state.go('reg');
                } else {
                    console.log('You are not sure');
                }
            });
        };

        // Open the login modal
        $scope.share = function () {
            $cordovaSocialSharing.share("Get relief from Cook/Maid/Driver/Babysitter on leave. " +
                "Book Now on-demand/monthly to get reliable and Blueteam verified worker. " +
                "https://goo.gl/545wov", "Book Now BlueTeam Verified Workers");
        };


    })
;