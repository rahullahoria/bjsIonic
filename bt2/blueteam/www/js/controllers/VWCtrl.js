/**
 * Created by spider-ninja on 12/12/16.
 */
angular.module('starter.controllers')
    .controller('VWCtrl', function ($scope, $state, $ionicLoading, $localstorage, $ionicHistory, $timeout, $stateParams, BlueTeam) {

        $scope.user_id = $localstorage.get('user_id');

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

        $scope.calculateAge = function calculateAge(birthdayRaw) { // birthday is a date
            var birthday = new Date(birthdayRaw);
            var ageDifMs = Date.now() - birthday.getTime();
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        };

        BlueTeam.getRefWorkers($scope.user_id)
            .then(function (d) {

                $scope.hide();
                $scope.workers = d['root']['workers'];
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
;