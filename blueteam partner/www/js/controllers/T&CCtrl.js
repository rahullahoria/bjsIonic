/**
 * Created by spider-ninja on 11/28/16.
 */
angular.module('starter.controllers')

.controller('T&CCtrl', function ($scope, $state, $ionicHistory, $timeout, $stateParams, BlueTeam) {


    BlueTeam.getTnc()
        .then(function (d) {

            //$scope.hide();
            //$ionicHistory.clearHistory();
            //$state.go('finish');
            $scope.conditions = d['root']['conditions'];
            $scope.TERMS = d['root']['TERMS'];
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