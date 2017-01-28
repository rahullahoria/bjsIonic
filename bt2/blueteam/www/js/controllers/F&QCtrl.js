/**
 * Created by spider-ninja on 12/12/16.
 */
angular.module('starter.controllers')
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


    });