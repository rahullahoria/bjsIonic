

angular.module('starter.controllers', ['ngCordova'])

.controller('ServiceListCtrl', function($scope, $state, $ionicHistory, $localstorage, BlueTeam) {
  if($localstorage.get('name') === undefined || $localstorage.get('mobile') === undefined 
      || $localstorage.get('name') === "" || $localstorage.get('mobile') === ""){
    $ionicHistory.clearHistory();
    $state.go('reg');
  }
  var temp = BlueTeam.getServices().then(function(d) {
    
    $ionicHistory.clearHistory();
    $scope.services = window.services = d['data']['services'];

  });


})

.controller('RegCtrl', function($scope, $state, $ionicHistory, $cordovaGeolocation, $localstorage, BlueTeam) {

  
  
  if($localstorage.get('name') === undefined || $localstorage.get('mobile') === undefined || $localstorage.get('email') === undefined 
      || $localstorage.get('name') === "" || $localstorage.get('mobile') === ""){

  }
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
      

      $scope.position = position;
      
    }, function(err) {
      // error
          $scope.position =  { "coords" : { "longitude" : null, "latitude" : null}};
      
  
    });


  $scope.regUser = function() {
    BlueTeam.regUser({
                                "root":{
                                        "gpsLocation" : $scope.position.coords.latitude + ',' + $scope.position.coords.longitude   ,
                                        "name": $scope.data.name, 
                                        "mobile": $scope.data.mobile,
                                        "email" : $scope.data.email 
                                      }
                    })
      .then(function(d) {

        $state.go('tab.service-list');
        //setObject
        $localstorage.set('name', $scope.data.name);
        $localstorage.set('mobile', $scope.data.mobile);
        $localstorage.set('email', $scope.data.email);

    });
  };
})


.controller('ServiceTypeCtrl', function($scope, $state, $stateParams) {
  
  
  if(window.services === undefined)
    $state.go('tab.service-list');

  for(i=0; i < window.services.length; i++){
    if(window.services[i].name == $stateParams.id){
      $scope.plans = window.services[i].plans;    
    }
  }
 
  $scope.service = $stateParams.id;

})

.controller('FinishCtrl', function($scope, $state, $timeout, $stateParams) {

    $scope.$on('$ionicView.enter', function() {
     // Code you want executed every time view is opened
     $timeout(function(){$state.go('tab.service-list');}, 5000)
  })

})

.controller('BookCtrl', function($scope, $state, $ionicHistory, $stateParams, $cordovaGeolocation, $localstorage, BlueTeam) {
  $scope.data = {};
  

  if(window.services === undefined)
    $state.go('tab.service-list');
  
  for(i=0; i < window.services.length; i++){

    if(window.services[i].name == $stateParams.id){

      for(j=0; j < window.services[i].plans.length; j++){
        
        if(window.services[i].plans[j].name == $stateParams.type){
 
        $scope.price = window.services[i].plans[j].price;
        }
      }    
    }
  }
  
  $scope.service = $stateParams.id;
  $scope.type = $stateParams.type;

  $scope.data.name = $localstorage.get('name');
  $scope.data.mobile = $localstorage.get('mobile');
  $scope.data.address = $localstorage.get('address');
  ;
  // to get current location of the user
  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      
      $scope.position = position;
      
    }, function(err) {
      // error
        $scope.position =  { "coords" : { "longitude" : null, "latitude" : null}};
    });

    // making post api call to the server by using angular based service
    
    $scope.conf = function() {
    
    $localstorage.set('name', $scope.data.name );
    $localstorage.set('mobile', $scope.data.mobile );
    $localstorage.set('address', $scope.data.address );

    BlueTeam.makeServiceRequest({
                                "root":{
                                        "name" : $scope.data.name,
                                        "mobile" : $scope.data.mobile,
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
