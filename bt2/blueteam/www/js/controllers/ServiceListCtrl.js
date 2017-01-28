/**
 * Created by spider-ninja on 12/12/16.
 */
angular.module('starter.controllers')
    .controller('ServiceListCtrl', function ($scope, $state, $ionicLoading, $ionicHistory,
                                             $localstorage, $ionicPopup, $ionicPlatform,
                                             $cordovaGeolocation, $ionicSlideBoxDelegate, BlueTeam) {

        if ($localstorage.get('name') === undefined || $localstorage.get('mobile') === undefined || $localstorage.get('name') === "" || $localstorage.get('mobile') === "") {
            $ionicHistory.clearHistory();
            $state.go('reg')
            return;
        }

        $scope.show = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
        };


        $ionicPlatform.ready(function () {

            //$scope.getLocation();
        });


        $scope.hide = function () {
            $ionicLoading.hide();
        };

        $scope.position = {
            "coords": {
                "longitude": null,
                "latitude": null
            }
        };

        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };
        $scope.getLocation = function() {
            alert('getting location');
            //console.log('trying');
            navigator.geolocation.getCurrentPosition(function(pos) {
                console.log('i am in');
                $scope.position = pos;
                alert((pos.coords.latitude, pos.coords.longitude));
                console.log(pos.coords.latitude, pos.coords.longitude);
                //$scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                //$scope.loading.hide();
            }, function(error) {
                console.log('i am error');
                alert('Unable to get location: ' + error.message);
            });
            console.log(JSON.stringify( $scope.position));
            /*if($scope.position.coords.longitude == null)
             setTimeout($scope.getLocation, 5000);

             $cordovaGeolocation
             .getCurrentPosition(posOptions)
             .then(function (position) {


             $scope.position = position;
             console.log(JSON.stringify(position));

             }, function (err) {
             //setTimeout($scope.getLocation, 10);

             console.log(JSON.stringify(err.message));
             $scope.position = {
             "coords": {
             "longitude": null,
             "latitude": null
             }
             };


             });*/
        };





        $scope.search = function (){
            console.log($scope.search.keywords);
            BlueTeam.search($scope.search.keywords).then(function (d) {

                $scope.searchResults = d.allServices;
                console.log(JSON.stringify($scope.searchResults));
                $scope.hide();
            });
        };
        $scope.show();

        BlueTeam.getServices().then(function (d) {

            $ionicHistory.clearHistory();
            $scope.services = window.services = d['root'];
            console.log(JSON.stringify($scope.services));
            $scope.hide();
        });

        //getServiceProviders

        BlueTeam.getServiceProviderServices().then(function (d) {

            $ionicHistory.clearHistory();
            $scope.serviceProviders = d.allServices;
            console.log(JSON.stringify($scope.serviceProviders));
            $scope.hide();
        });

        BlueTeam.getHotServices().then(function (d) {

            $ionicHistory.clearHistory();
            $scope.hotService = d.allServices;
            console.log(JSON.stringify($scope.hotService));
            $scope.hide();
        });

        var slideIndex = 0;
        if ($localstorage.get('name'))
        carousel();

        function carousel() {
            var i;
            var x = document.getElementsByClassName("mySlides");
            for (i = 0; i < x.length; i++) {
                x[i].style.display = "none";
            }
            slideIndex++;
            if (slideIndex > x.length) {slideIndex = 1}
            x[slideIndex-1].style.display = "block";
            setTimeout(carousel, 5000);
        }




    });