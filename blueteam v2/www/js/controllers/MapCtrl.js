angular.module('starter.controllers')
    .controller('MapCtrl', function($scope, $state, $cordovaGeolocation,$ionicPlatform,$compile,$ionicLoading) {
        var options = {timeout: 10000, enableHighAccuracy: false};

        $ionicPlatform.ready(function () {
            setTimeout(initialize, 2000);

        });

        $scope.lat = 28.4595;
        $scope.lng = 77.0266;

        function initialize() {
            var myLatlng = new google.maps.LatLng($scope.lat,$scope.lng);

            var mapOptions = {
                center: myLatlng,
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("map"),
                mapOptions);



            var input = document.getElementById('pac-input');
            var searchBox = new google.maps.places.SearchBox(input);
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

            // Bias the SearchBox results towards current map's viewport.
            map.addListener('bounds_changed', function() {
                searchBox.setBounds(map.getBounds());
            });

            google.maps.event.addListener(map,'center_changed', function() {/*
             $.get( "http://api.sp.blueteam.in/location/"+map.getCenter().lat()+","+map.getCenter().lng(), function( data ) {
             //alert( "Data Loaded: " + data );
             });*/
                console.log(map.getCenter().lat()+","+map.getCenter().lng());
                $scope.lat = map.getCenter().lat();
                $scope.lng = map.getCenter().lng();
            });


            var markers = [];
            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
            searchBox.addListener('places_changed', function() {
                var places = searchBox.getPlaces();

                if (places.length == 0) {
                    return;
                }

                // Clear out the old markers.
                markers.forEach(function(marker) {
                    marker.setMap(null);
                });
                markers = [];

                // For each place, get the icon, name and location.
                var bounds = new google.maps.LatLngBounds();
                places.forEach(function(place) {
                    if (!place.geometry) {
                        console.log("Returned place contains no geometry");
                        return;
                    }
                    var icon = {
                        url: place.icon,
                        size: new google.maps.Size(71, 71),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(25, 25)
                    };



                    if (place.geometry.viewport) {
                        // Only geocodes have viewport.
                        bounds.union(place.geometry.viewport);
                    } else {
                        bounds.extend(place.geometry.location);
                    }
                });
                map.fitBounds(bounds);

            });

            marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                draggable: true,
                animation: google.maps.Animation.DROP
            });
            marker.bindTo('position', map, 'center');



            $scope.map = map;
        }
        //google.maps.event.addDomListener(window, 'load', initialize);

        //initialize();

        $scope.centerOnMe = function() {
            if(!$scope.map) {
                return;
            }

            /*$scope.loading = $ionicLoading.show({
             content: 'Getting current location...',
             showBackdrop: false
             });

             setTimeout($scope.loading.hide, 2000);*/

            navigator.geolocation.getCurrentPosition(function(pos) {
                $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                $scope.loading.hide();
            }, function(error) {
                alert('Unable to get location: ' + error.message);
            });
        };

        $scope.clickTest = function() {
            alert('Example of infowindow with ng-click')
        };

    });
