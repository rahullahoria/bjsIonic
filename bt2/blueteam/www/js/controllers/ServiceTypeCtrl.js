/**
 * Created by spider-ninja on 12/12/16.
 */
angular.module('starter.controllers')
    .controller('ServiceTypeCtrl', function ($scope, $state, $stateParams,BlueTeam) {

        $scope.serviceId = $stateParams.id;
        $scope.serviceName = $stateParams.name;
        $scope.img = $stateParams.img;
        $scope.lat = $stateParams.lat;
        $scope.lng = $stateParams.lng;


        BlueTeam.getServiceProviders($stateParams.id,$scope.lat+","+$scope.lng).then(function (d) {

            //$ionicHistory.clearHistory();
            $scope.serviceProviders = d.service_providers;

            for(var i = 0;i < $scope.serviceProviders.length;i++){
                this.temp = i;
                $scope.serviceProviders[i].quality_score = 3;
                $scope.serviceProviders[i].quality_count = 1;

                BlueTeam.getServiceProviderScore($scope.serviceProviders[i].id).then(function (d) {

                    var serviceProviderQuility = d.counts;
                    //'complain','suggestion','appreciation','marvelous'
                    var add = 0;

                    for(var j = 0; j < serviceProviderQuility.length; j++ ) {
                        if(serviceProviderQuility[j].type == "complain")
                            add = 1;
                        if(serviceProviderQuility[j].type == "suggestion")
                            add = 2;
                        if(serviceProviderQuility[j].type == "appreciation")
                            add = 3;
                        if(serviceProviderQuility[j].type == "marvelous")
                            add = 4;
                        $scope.serviceProviders[this.temp].quality_score += add*serviceProviderQuility[j].count;
                        $scope.serviceProviders[this.temp].quality_count += serviceProviderQuility[j].count*1;
                        //console.log($scope.serviceProviders[this.temp].quality_score,$scope.serviceProviders[this.temp].quality_count);
                    }
                    //console.log(JSON.stringify($scope.serviceProviderD));

                });

            }
            console.log(JSON.stringify($scope.serviceProviders));
            //$scope.hide();
        });





    });