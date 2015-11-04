

angular.module('starter.controllers', ['ngCordova'])

.controller('ServiceListCtrl', function($scope, $state, $ionicLoading, $ionicHistory, $localstorage, BlueTeam) {
  
  if($localstorage.get('name') === undefined || $localstorage.get('mobile') === undefined 
      || $localstorage.get('name') === "" || $localstorage.get('mobile') === ""){
    $ionicHistory.clearHistory();
    $state.go('reg');
  }

  $scope.show = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide();
  };
  
  $scope.show();

  var temp = BlueTeam.getServices().then(function(d) {
    
    $ionicHistory.clearHistory();
    $scope.services = window.services = d['data']['services'];
    $scope.hide();
  });


})

.controller('RegCtrl', function($scope, $state, $ionicLoading, $ionicHistory, $cordovaGeolocation, $localstorage, BlueTeam) {

  $scope.show = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide();
  };  
  
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
    $scope.show();
    BlueTeam.regUser({
                                "root":{
                                        "gpsLocation" : $scope.position.coords.latitude + ',' + $scope.position.coords.longitude   ,
                                        "name": $scope.data.name, 
                                        "mobile": $scope.data.mobile,
                                        "email" : $scope.data.email 
                                      }
                    })
      .then(function(d) {

        //setObject
        $localstorage.set('name', $scope.data.name);
        $localstorage.set('mobile', $scope.data.mobile);
        $localstorage.set('email', $scope.data.email);

        $scope.hide();
        $state.go('tab.service-list');

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

.controller('FinishCtrl', function($scope, $state, $ionicHistory, $timeout, $stateParams) {

    $scope.$on('$ionicView.enter', function() {
     // Code you want executed every time view is opened
     $ionicHistory.clearHistory();
     $timeout(function(){$state.go('tab.service-list');}, 10000)
  })

})

.controller('BookCtrl', function($scope, $state, $ionicLoading, $timeout, $ionicHistory, $stateParams, $cordovaGeolocation, $localstorage, BlueTeam) {
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

    $scope.show = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
    $timeout(function(){$scope.hide();}, 5000);
    
  };
  $scope.hide = function(){
    $ionicLoading.hide();
  };

    // making post api call to the server by using angular based service
    
    $scope.conf = function() {
    $scope.show();
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
        $scope.hide();
        $ionicHistory.clearHistory();
        $state.go('finish');
      //$scope.services = d['data']['services'];
    });
  };

  $scope.settings = {
    enableFriends: true
  };
});
