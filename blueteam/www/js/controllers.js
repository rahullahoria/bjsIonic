angular.module('starter.controllers', ['ngCordova'])

.controller('ServiceListCtrl', function($scope, BlueTeam) {

  var temp = BlueTeam.getServices().then(function(d) {

    $scope.services = d['data']['services'];
  });

  $scope.remove = function() {
    Chats.remove(chat);
  };

})

.controller('RegCtrl', function($scope, $state, $cordovaGeolocation, $localstorage, BlueTeam) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  /*var temp = Chats.all();
  console.log(temp['data']['services']);
  $scope.chats = temp['data']['services'];

  $scope.remove = function(chat) {
    Chats.remove(chat);
  };*/

  $scope.data = {};
  
  $scope.position = null;
  
  // geting current location of the user
  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      console.log(position);

      $scope.position = position;
      
      //var lat  = position.coords.latitude;
      //var long = position.coords.longitude;
    }, function(err) {
      // error
          $scope.position =  { "coords" : { "longitude" : null, "latitude" : null}};
      
  
    });


  $scope.regUser = function() {
    BlueTeam.regUser({
                                "root":{
                                        "gpsLocation" : $scope.position.coords.latitude + ',' + $scope.position.coords.longitude   ,
                                        "name": $scope.data.name, 
                                        "mobile": $scope.data.mobile 
                                      }
                    })
      .then(function(d) {

        $state.go('tab.service-list');

        //$localstorage.set('name', 'Max');
  //console.log($localstorage.get('namea'));


      //$scope.services = d['data']['services'];
    });
  };
})


.controller('ServiceTypeCtrl', function($scope, $stateParams) {
  console.log($stateParams);
  $scope.service = $stateParams.id;

})

.controller('FinishCtrl', function($scope, $state, $timeout, $stateParams) {

 $timeout(function(){$state.go('tab.service-list');}, 5000);
})

.controller('BookCtrl', function($scope, $state, $stateParams, $cordovaGeolocation, BlueTeam) {
  $scope.data = {};
  console.log($stateParams);
  $scope.service = $stateParams.id;
  $scope.type = $stateParams.type;

  // to get current location of the user
  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      console.log(position);
      $scope.position = position;
      //var lat  = position.coords.latitude;
      //var long = position.coords.longitude;
    }, function(err) {
      // error
      $scope.position.coords.longitude = null;
      $scope.position.coords.latitude = null;
    });

    // making post api call to the server by using angular based service

    $scope.conf = function() {
    BlueTeam.makeServiceRequest({
                                "root":{
                                        'location' : $scope.position.coords.latitude + ',' + $scope.position.coords.longitude   ,
                                        "service": $scope.service,
                                        "type": $scope.type, 
                                        "address": $scope.data.address 
                                      }
                                })
      .then(function(d) {
        $state.go('tab.finish');
      //$scope.services = d['data']['services'];
    });
  };

  $scope.settings = {
    enableFriends: true
  };
});
