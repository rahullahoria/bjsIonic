/**
 * Created by spider-ninja on 11/27/16.
 */
angular.module('starter.controllers')


    .controller('MonthlyIncomeCtrl', function ($scope, $state, $ionicLoading, $ionicHistory, $localstorage, BlueTeam) {

        /*if ($localstorage.get('name') === undefined || $localstorage.get('mobile') === undefined || $localstorage.get('name') === "" || $localstorage.get('mobile') === "") {
         $ionicHistory.clearHistory();
         $state.go('reg');
         }*/

        $scope.show = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };
        $scope.thisMonthTotal = 0;

        $scope.show();

        BlueTeam.getMonthlyIncome(1).then(function (d) {


            $scope.invoices = d.invoices;

            for(var i =0; i < $scope.invoices.length; i++){
                //new Date(millis)
                $scope.invoices[i].creation = new Date($scope.invoices[i].creation);
                $scope.thisMonthTotal += 1*$scope.invoices[i].amount ;
            }

            $scope.hide();
        });


    });
