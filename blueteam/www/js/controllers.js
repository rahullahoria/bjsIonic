

angular.module('starter.controllers', ['ngCordova'])

.controller('ServiceListCtrl', function($scope, $state, $ionicHistory, $localstorage, BlueTeam) {
  if($localstorage.get('name') === "undefined" || $localstorage.get('mobile') === "undefined" 
      || $localstorage.get('name') === "" || $localstorage.get('mobile') === ""){
    $ionicHistory.clearHistory();
    $state.go('reg');
  }
  var temp = BlueTeam.getServices().then(function(d) {
    console.log($localstorage.get('name'));
    $ionicHistory.clearHistory();
    $scope.services = window.services = d['data']['services'];

  });


})

.controller('RegCtrl', function($scope, $state, $ionicHistory, $cordovaGeolocation, $localstorage, BlueTeam) {

  console.log($localstorage.get('name'));
  
  if($localstorage.get('name') === "undefined" || $localstorage.get('mobile') === "undefined"){}
    else{
    $ionicHistory.clearHistory();
    $state.go('tab.service-list');
  }

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
        //setObject
        $localstorage.set('name', $scope.data.name);
        $localstorage.set('mobile', $scope.data.mobile);


        //$localstorage.set('name', 'Max');
        //console.log($localstorage.get('namea'));


        //$scope.services = d['data']['services'];
    });
  };
})


.controller('ServiceTypeCtrl', function($scope, $state, $stateParams) {
  console.log($stateParams, window.services);
  
  if(window.services === undefined)
    $state.go('tab.service-list');

  for(i=0; i < window.services.length; i++){
    if(window.services[i].name == $stateParams.id){
      $scope.plans = window.services[i].plans;    
    }
  }
  console.log($scope.plans);
  $scope.service = $stateParams.id;

})

.controller('FinishCtrl', function($scope, $state, $timeout, $stateParams) {

 $timeout(function(){$state.go('tab.service-list');}, 5000);
})

.controller('BookCtrl', function($scope, $state, $ionicHistory, $stateParams, $cordovaGeolocation, $localstorage, BlueTeam) {
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
        $scope.position =  { "coords" : { "longitude" : null, "latitude" : null}};
    });

    // making post api call to the server by using angular based service

    $scope.conf = function() {
    BlueTeam.makeServiceRequest({
                                "root":{
                                        "name" : $localstorage.get('name'),
                                        "mobile" : $localstorage.get('mobile'),
                                        "location" : $scope.position.coords.latitude + ',' + $scope.position.coords.longitude   ,
                                        "service": $scope.service,
                                        "type": $scope.type, 
                                        "address": $scope.data.address 
                                      }
                                })
      .then(function(d) {
        $ionicHistory.clearHistory();
        $state.go('finish');
      //$scope.services = d['data']['services'];
    });
  };

  $scope.settings = {
    enableFriends: true
  };
});
