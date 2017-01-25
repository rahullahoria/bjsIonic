/**
 * Created by spider-ninja on 11/27/16.
 */
angular.module('starter.controllers')


    .controller('MonthlyIncomeCtrl', function ($scope, $state, $ionicLoading, $ionicHistory, $localstorage, BlueTeam) {

        if ($localstorage.get('user_id') === undefined || $localstorage.get('user_id') === "") {
            $ionicHistory.clearHistory();
            $state.go('reg');
            return;
        }

        console.log($localstorage.get('user'));
        $scope.user = JSON.parse($localstorage.get('user'));
        $scope.user_id = $localstorage.get('user_id');
        $scope.services = JSON.parse($localstorage.get('services'));

        $scope.show = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };
        $scope.thisMonthTotal = 0;

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        $scope.monthYear = yyyy + '-' + mm + '-'+ dd;

        $scope.graph = {};                        // Empty graph object to hold the details for this graph
        $scope.graph.data = [                     // Add bar data, this will set your bars height in the graph
            //Awake
            [],
            //Asleep
            [],
            []
        ];
        $scope.graph.labels = [];    // Add labels for the X-axis
        $scope.graph.series = ['Incoming', 'Outgoing'];  // Add information for the hover/touch effect

        $scope.graph.colors = ['#11c1f3','#ffc900','#7FFD1F','#68F000'];




        $scope.info = {};
        $scope.info.months = [];
        $scope.info.months[0] = "January";
        $scope.info.months[1] = "February";
        $scope.info.months[2] = "March";
        $scope.info.months[3] = "April";
        $scope.info.months[4] = "May";
        $scope.info.months[5] = "June";
        $scope.info.months[6] = "July";
        $scope.info.months[7] = "August";
        $scope.info.months[8] = "September";
        $scope.info.months[9] = "October";
        $scope.info.months[10] = "November";
        $scope.info.months[11] = "December";

        $scope.doRefresh = function(d){
            $scope.monthYear = d;
            $scope.thisMonthTotal = 0;
            $scope.loadDateArr = $scope.monthYear.split('-');
            console.log($scope.monthYear);
            BlueTeam.getMonthlyIncome($scope.user_id,$scope.monthYear).then(function (d) {

                $scope.show();

                $scope.invoices = d.invoices.invoices;
                $scope.months = d.invoices.months;

                for(var i =0; i < $scope.months.length; i++){
                    $scope.graph.labels[i] = $scope.info.months[$scope.months[i].month-1].substring(0, 3)   + "-" + $scope.months[i].year.substring(2, 4);
                    $scope.graph.data[0][i] = $scope.months[i].amount;
                    $scope.graph.data[1][i] = $scope.months[i].expanse_amount;
                }

                $scope.graph.labels.reverse();
                $scope.graph.data[0].reverse();
                $scope.graph.data[1].reverse();

                for(var i =0; i < $scope.invoices.length; i++){
                    //new Date(millis)
                    $scope.invoices[i].creation = new Date($scope.invoices[i].creation);
                    $scope.thisMonthTotal += 1*$scope.invoices[i].amount ;
                }
                $scope.$broadcast('showMonthly');

                $scope.hide();
            }).finally(function () {
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        $scope.doRefresh($scope.monthYear);


    })
    .controller("repartition", function ($scope,BlueTeam) {
        $scope.$on('showMonthly', function() {
            $scope.monthly = BlueTeam.getLocMonthlyIncome();
            console.log('lots',$scope.monthly.invoices.invoices[0].creation.year);
            var str = $scope.monthly.invoices.invoices[0].creation;


            $scope.expanses = $scope.monthly.invoices.expanses;



            for(var i =0; i < $scope.expanses.length; i++){
                var labelIndex = $scope.repartition.labels.indexOf($scope.expanses[i].type);
                if(labelIndex == -1){
                $scope.repartition.data.push($scope.expanses[i].amount*1);
                $scope.repartition.labels.push($scope.expanses[i].type);
                }

                else {
                    $scope.repartition.data[labelIndex] += $scope.invoices[i].amount*1;

                }

            }


        });

        $scope.graph.colors = ['#11c1f3','#ffc900','#7FFD1F','#68F000'];

        $scope.repartition = {};
        $scope.repartition.labels = [];
        $scope.repartition.data = [];
    })
    .controller("lots", function ($scope, BlueTeam) {
        $scope.$on('showMonthly', function() {
            $scope.monthly = BlueTeam.getLocMonthlyIncome();
            console.log('lots',$scope.monthly.invoices.invoices[0].creation.year);
            var str = $scope.monthly.invoices.invoices[0].creation;


            $scope.months = $scope.monthly.invoices.months;

            for(var i =0; i < $scope.months.length; i++){
                if($scope.months[i].year == str.getFullYear() && $scope.months[i].month == str.getMonth()+1){
                    console.log($scope.months[i].amount + $scope.months[i].expanse_amount);
                    $scope.data[0] = $scope.months[i].amount;
                    $scope.data[1] = $scope.months[i].expanse_amount;
                    $scope.labels = ["Incoming:" + (($scope.months[i].amount*1/($scope.months[i].amount*1 + $scope.months[i].expanse_amount*1))*100).toFixed(2)+ "%",
                                    "Outgoing:" + (($scope.months[i].expanse_amount*1/($scope.months[i].amount*1 + $scope.months[i].expanse_amount*1))*100).toFixed(2)+ "%"];
                    //$scope.labels[0] += ":" + (($scope.months[i].amount*1/($scope.months[i].amount*1 + $scope.months[i].expanse_amount*1))*100).toFixed(2)+ "%";
                    //$scope.labels[1] += ":" + (($scope.months[i].expanse_amount*1/($scope.months[i].amount*1 + $scope.months[i].expanse_amount*1))*100).toFixed(2)+ "%";
                    console.log(JSON.stringify($scope.data));
                }

            }
        });

        $scope.graph.colors = ['#11c1f3','#ffc900','#7FFD1F','#68F000'];

        //$scope.labels = ["Incoming'", "Outgoing"];
        $scope.data = [];
    })
    .controller("pie", function ($scope) {
        $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
        $scope.series = ['Series A', 'Series B'];
        $scope.data = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ];
        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };
        $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
        $scope.options = {
            scales: {
                yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left'
                    },
                    {
                        id: 'y-axis-2',
                        type: 'linear',
                        display: true,
                        position: 'right'
                    }
                ]
            }
        };
    })
    .controller("bar", function ($scope,BlueTeam) {
        $scope.$on('showMonthly', function() {
            $scope.monthly = BlueTeam.getLocMonthlyIncome();
            console.log('lots',$scope.monthly.invoices.invoices[0].creation.year);
            var str = $scope.monthly.invoices.invoices[0].creation;


            $scope.invoices = $scope.monthly.invoices.invoices;

            for(var i =0; i < $scope.invoices.length; i++){
                var labelIndex = $scope.bar.labels.indexOf($scope.invoices[i].service_name);
                if(labelIndex == -1){
                $scope.bar.data.push($scope.invoices[i].amount*1);
                $scope.bar.labels.push($scope.invoices[i].service_name);
                }
                else {
                    $scope.bar.data[labelIndex] += $scope.invoices[i].amount*1;

                }

            }
        });

        $scope.graph.colors = ['#11c1f3','#ffc900','#7FFD1F','#68F000'];

        $scope.bar = {};
        $scope.bar.labels = [];
        $scope.bar.data = [];
    });
