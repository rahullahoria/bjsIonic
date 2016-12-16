/**
 * Created by spider-ninja on 11/28/16.
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

        if ($localstorage.get('user_id') !== undefined && $localstorage.get('user_id') !== "") {
            $scope.user = JSON.parse($localstorage.get('user'));
            $scope.user_id = $localstorage.get('user_id');
            $scope.services = JSON.parse($localstorage.get('services'));
        }



        /*$scope.type = $localstorage.get('type');
        $scope.name = $localstorage.get('name');*/

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
                    $localstorage.set('user', "");
                    $localstorage.set('services', "");
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
            $cordovaSocialSharing.share("Let's grow fast with technology\n " +
                "Empower yourself with BT partner tools, lets grow together. " +
                "http://goo.gl/rLK3s5", "Let's grow fast with technology");
        };


    })


;