angular.module('starter.controllers', ['ionic', 'ngCordova', 'ionic-timepicker','ion-datetime-picker','ionic.rating'])

    .controller('ServiceListCtrl', function ($scope, $state, $ionicLoading, $ionicHistory, $localstorage, BlueTeam) {

        if ($localstorage.get('name') === undefined || $localstorage.get('mobile') === undefined || $localstorage.get('name') === "" || $localstorage.get('mobile') === "") {
            $ionicHistory.clearHistory();
            $state.go('reg');
        }

        $scope.show = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };

        $scope.show();

        var temp = BlueTeam.getServices().then(function (d) {

            $ionicHistory.clearHistory();
            $scope.services = window.services = d['root'];
            console.log(JSON.stringify($scope.services));
            $scope.hide();
        });


    })

    .controller('ContactCtrl', function ($scope, Contactlist) {
        $scope.contacts = Contactlist.getAllContacts();
    })

    .controller('WorkerTimerCtrl', function ($scope, $state, $ionicLoading, $window, $ionicHistory, $cordovaGeolocation,
                                             $cordovaDevice, $localstorage, PhoneContactsFactory, $timeout, $ionicPlatform, BlueTeam) {
        $scope.stop = true;

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
            .then(function (position) {


                $scope.position = position;

            }, function (err) {

                console.log(JSON.stringify(err));
                $scope.position = {
                    "coords": {
                        "longitude": null,
                        "latitude": null
                    }
                };


            });


        BlueTeam.getWork($localstorage.get('user_id')).then(function (d) {


            $scope.work = d['root'].work;
            /*{"root":
             {"work":
             {
             "user_worker_id":"1",
             "service_request_id":"1",
             "start_time":"18:25:38",
             "end_time":"10:36:38",
             "customer_name":"rahul need maid",
             "customer_mobile": "8989898911",
             "customer_address":"sdaf"
             }
             }
             }*/

        });

        $scope.reload = function () {
            $window.location.reload(true);
        }

        $scope.startTimer = function () {
            var d = new Date();
            $scope.startTime = "" + new Date();
            $scope.startTimeShow = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
                d.getFullYear() + " at " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
            $scope.stop = true;
            console.log($scope.startTime);

            $scope.upTime($scope.startTime);
            /*{
             "root":{
             "id": 2,
             "start_time": "Mon Mar 07 2016 19:37:59 GMT+0530 (IST)",
             "service_request_id": 1,
             "device_id": "safd",
             "gps_location":"21.132,123.231"

             }

             }*/
            BlueTeam.postWork($localstorage.get('user_id'), {
                    "root": {
                        "gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                        "start_time": $scope.startTime,
                        "service_request_id": $scope.work.service_request_id/*,
                         "device_id": $cordovaDevice.getUUID()*/
                    }
                })
                .then(function (d) {

                    $scope.work.log_id = d['root'].id;

                });
        };

        $scope.stopTimer = function () {
            var d = new Date();
            $scope.stop = false;
            $scope.endTime = "" + new Date();
            $scope.endTimeShow = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
                d.getFullYear() + " at " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);

            BlueTeam.postWork($localstorage.get('user_id'), {
                    "root": {
                        "id": $scope.work.log_id,
                        "gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                        "end_time": $scope.endTime,
                        "service_request_id": $scope.work.service_request_id/*,
                         "device_id": $cordovaDevice.getUUID()*/
                    }
                })
                .then(function (d) {
                    $timeout(function () {
                        $window.location.reload(true);
                    }, 10000);
                    $scope.work.log_id = d['root'].id;

                });
        };

        $scope.now = null;
        $scope.upTime = function (countTo) {
            if ($scope.stop == true) {
                now = new Date();
                //*console.log(''+now*/);
                countTo = new Date(countTo);
                difference = (now - countTo);

                $scope.days = Math.floor(difference / (60 * 60 * 1000 * 24) * 1);
                $scope.hours = Math.floor((difference % (60 * 60 * 1000 * 24)) / (60 * 60 * 1000) * 1);
                $scope.mins = Math.floor(((difference % (60 * 60 * 1000 * 24)) % (60 * 60 * 1000)) / (60 * 1000) * 1);
                $scope.secs = Math.floor((((difference % (60 * 60 * 1000 * 24)) % (60 * 60 * 1000)) % (60 * 1000)) / 1000 * 1);

                /*document.getElementById('days').firstChild.nodeValue = days;
                 document.getElementById('hours').firstChild.nodeValue = hours;
                 document.getElementById('minutes').firstChild.nodeValue = mins;
                 document.getElementById('seconds').firstChild.nodeValue = secs;*/

                clearTimeout($scope.upTime.to);
                $scope.upTime.to = $timeout(function () {
                    $scope.upTime(countTo);
                }, 1000);
            }
        }
    })

    .controller('RegCtrl', function ($scope, $state, $ionicLoading, $ionicHistory, $cordovaGeolocation, $localstorage, PhoneContactsFactory, $ionicPlatform, $cordovaDevice, BlueTeam) {


        $scope.data = {"name": "", "email": "", "mobile": ""};

        console.log("regcont started");
        $scope.registered = true;
        $scope.checked = false;

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
            .then(function (position) {


                $scope.position = position;

            }, function (err) {

                console.log(JSON.stringify(err));
                $scope.position = {
                    "coords": {
                        "longitude": null,
                        "latitude": null
                    }
                };


            });


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
                        "gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
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
                BlueTeam.checkMobile($scope.data.mobile)
                    .then(function (d) {
                        $scope.checked = true;
                        console.log(d['root'].user.user_exist);
                        $scope.registered = d['root'].user.user_exist;

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


        };

        $ionicPlatform.ready(function () {
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
                                /*name: contacts[i].name.formatted,*/
                                id: contacts[i].id,
                                all: JSON.stringify(contacts[i])
                            });


                            $buff.push({
                                /*name: contacts[i].name.formatted,*/
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
            $scope.findContact();


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
            if ($scope.registered){
                $scope.login();
                return;
            }

            if ($scope.data.password == $scope.data.conf_password) {
                $scope.show();
                BlueTeam.regUser({
                        "root": {
                            "gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                            "name": $scope.data.name,
                            "mobile": $scope.data.mobile,
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

                        $scope.hide();
                        $state.go('tab.service-list');

                    });
            } else $scope.pwdError = true;
        };
    })


    .controller('ServiceTypeCtrl', function ($scope, $state, $stateParams) {


        if (window.services === undefined)
            $state.go('tab.service-list');

        for (i = 0; i < window.services.length; i++) {
            if (window.services[i].name == $stateParams.id) {
                $scope.plans = window.services[i].plans;
            }
        }

        $scope.service = $stateParams.id;

    })

    .controller('FinishCtrl', function ($scope, $state, $ionicHistory, $timeout, $stateParams) {

        $scope.$on('$ionicView.enter', function () {
            // Code you want executed every time view is opened
            $ionicHistory.clearHistory();
            $timeout(function () {
                $state.go('tab.service-list');
            }, 10000)
        })

    })

    .controller('AboutCtrl', function ($scope, $state, $ionicHistory, $timeout, $stateParams) {


    })
    .controller('SurveyCtrl', function ($scope, $state, $ionicHistory, $timeout, $stateParams) {

        $scope.goodAns = ["B","A","B","B","B","B","B","A"];
        $scope.showQ = true;
        $scope.postSurvey = function(){
            $scope.showQ = false;

        };
    })

    .controller('PriceCalCtrl', function ($scope, $state, $ionicLoading, $timeout, $ionicHistory, $stateParams, $cordovaGeolocation, $localstorage, BlueTeam) {
        $scope.data = {};



        $scope.data.hours = "";
        $scope.selectedTime = new Date();
        $scope.data.time = ("0"+($scope.selectedTime.getHours()%12)).slice(-2) + ':'
            + "00" + " "
            + (($scope.selectedTime.getHours()>12)?"PM":"AM");
        $scope.data.time24 = "";

        $scope.timePickerCallback = function (val) {
            if (typeof (val) === 'undefined') {
                console.log('Time not selected');
            } else {
                var selectedTime = $scope.selectedTime = new Date(val * 1000);
                console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
                $scope.data.time24 = ("0"+selectedTime.getUTCHours()).slice(-2) + ':' + ("0"+selectedTime.getUTCMinutes()).slice(-2) + ':00' ;
                $scope.data.time = ("0"+(parseInt( selectedTime.getUTCHours())%12)).slice(-2) + ':' + ("0"+selectedTime.getUTCMinutes()).slice(-2) + " " + ((selectedTime.getUTCHours()>12)?"PM":"AM");
                console.log($scope.data.time24);
            }
        };


        $scope.data.name = $localstorage.get('name');
        $scope.data.mobile = parseInt($localstorage.get('mobile'));
        $scope.data.address = $localstorage.get('address');

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
            .then(function (position) {

                $scope.position = position;

            }, function (err) {
                // error
                console.log(JSON.stringify(err));
                $scope.position = {
                    "coords": {
                        "longitude": null,
                        "latitude": null
                    }
                };
            });

        $scope.show = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $timeout(function () {
                $scope.hide();
            }, 5000);

        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };

        $scope.timePickerObject = {
            inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
            step: 15,  //Optional
            format: 12,  //Optional
            titleLabel: 'Start time',  //Optional
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {    //Mandatory
                $scope.timePickerCallback(val);
            }
        };

        // making post api call to the server by using angular based service

        $scope.cal = function () {
            $scope.show();


            BlueTeam.getPrice($scope.data.service)
                .then(function (d) {
                    $scope.hide();

                    $scope.prices = d['root'].cost;

                    var noOfMaxDays = (parseInt($scope.data.days)>26 || parseInt($scope.data.days)<21)?26:(parseInt($scope.data.days));

                    $scope.max = noOfMaxDays*parseInt($scope.prices[0].cost);
                    for(var i = 1;i < $scope.data.hours;i++) {
                        $scope.max = $scope.max + (noOfMaxDays * parseInt($scope.prices[($scope.selectedTime.getUTCHours() + i)%24].cost));
                        console.log($scope.selectedTime.getUTCHours() + i);
                    }

                    $scope.min = 21*parseInt($scope.prices[0].cost)   ;
                    for(var i = 1;i < $scope.data.hours;i++) {
                        $scope.min = $scope.min + (21 * parseInt($scope.prices[($scope.selectedTime.getUTCHours() + i)%24].cost));
                        console.log($scope.selectedTime.getUTCHours() + i);
                    }

                    $scope.data.days = (parseInt($scope.data.days)<15)?15:$scope.data.days;
                    $scope.forDays = parseInt($scope.data.days)*parseInt($scope.prices[0].cost)   ;
                    for(var i = 1;i < $scope.data.hours;i++) {
                        $scope.forDays = $scope.forDays + (parseInt($scope.data.days) * parseInt($scope.prices[($scope.selectedTime.getUTCHours() + i)%24].cost));
                        console.log($scope.selectedTime.getUTCHours() + i);
                    }

                    //<strike>
                    $scope.discount = ($scope.forDays>$scope.max)?$scope.forDays:false ;
                    $scope.forDays = ($scope.forDays>$scope.max)?$scope.max:$scope.forDays;
                    $scope.avg = ($scope.max + $scope.min)/2;

                    console.log("max",$scope.max,$scope.min,$scope.avg,$scope.forDays);
                });
        };

    })

    .controller('FeedbackCtrl', function ($scope, $state, $ionicLoading, $ionicHistory, $timeout, $stateParams, $localstorage, $cordovaGeolocation, BlueTeam) {
        $scope.data = {};

        $scope.show = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $timeout(function () {
                $scope.hide();
            }, 5000);

        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };

        $scope.data.name = $localstorage.get('name');
        $scope.data.mobile = parseInt($localstorage.get('mobile'));
        $scope.data.email = "" + $localstorage.get('email');
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
            .then(function (position) {

                $scope.position = position;

            }, function (err) {
                // error
                console.log(JSON.stringify(err));
                $scope.position = {
                    "coords": {
                        "longitude": null,
                        "latitude": null
                    }
                };
            });

        $scope.feedback = function () {
            $scope.show();


            BlueTeam.postFeedback({
                    "root": {
                        "name": $scope.data.name,
                        "mobile": "" + $scope.data.mobile,
                        "gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                        "email": $scope.data.email,
                        "feedback": $scope.data.feedback_text
                    }
                })
                .then(function (d) {
                    $scope.hide();
                    $ionicHistory.clearHistory();
                    $state.go('finish');
                    //$scope.services = d['data']['services'];
                });
        };

    })

    .controller('T&CCtrl', function ($scope, $state, $ionicHistory, $timeout, $stateParams, BlueTeam) {


        BlueTeam.getTnc()
            .then(function (d) {

                //$scope.hide();
                //$ionicHistory.clearHistory();
                //$state.go('finish');
                $scope.conditions = d['root']['conditions'];
                $scope.TERMS = d['root']['TERMS'];
            });

        $scope.toggleItem = function (item) {
            if ($scope.isItemShown(item)) {
                $scope.shownItem = null;
            } else {
                $scope.shownItem = item;
            }
        };
        $scope.isItemShown = function (item) {
            return $scope.shownItem === item;
        };

    })
    .controller('ServiceRequestCtrl', function ($scope, $state, $ionicHistory, $timeout, $stateParams, $localstorage, BlueTeam) {

        $scope.user_id = $localstorage.get('user_id');
        BlueTeam.getMysr($localstorage.get('mobile'))
            .then(function (d) {

                //$scope.hide();
                //$ionicHistory.clearHistory();
                //$state.go('finish');
                $scope.srs = d['root']['srs'];
                console.log(JSON.stringify($scope.srs));
            });

        // set the rate and max variables
        $scope.rating = {};

        $scope.rating.max = 5;

        $scope.updateRating = function($user_id,$rating){
            BlueTeam.updateRating({
                    "root": {
                        "customer_id": $scope.user_id,
                        "user_id": $user_id,
                        "rating": "" + $rating/*,
                        "device_id": $cordovaDevice.getUUID()*/
                    }
                })
                .then(function (d) {
                    //$scope.services = d['data']['services'];
                    $scope.doRefresh();
                });
        };
        $scope.doRefresh = function() {
            BlueTeam.getMysr($localstorage.get('mobile'))
                .then(function (d) {

                    //$scope.hide();
                    //$ionicHistory.clearHistory();
                    //$state.go('finish');
                    $scope.srs = d['root']['srs'];

                    console.log(JSON.stringify($scope.srs));
                })
                .finally(function() {
                    // Stop the ion-refresher from spinning
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };

        $scope.toggleItem = function (item) {
            if ($scope.isItemShown(item)) {
                $scope.shownItem = null;
            } else {
                $scope.shownItem = item;
            }
        };
        $scope.isItemShown = function (item) {
            return $scope.shownItem === item;
        };

    })

    .controller('BlueteamVerifiedTypeCtrl', function ($scope, $state, $ionicHistory, $timeout, $stateParams, BlueTeam) {

        BlueTeam.getVerification()
            .then(function (d) {

                //$scope.hide();
                //$ionicHistory.clearHistory();
                //$state.go('finish');
                $scope.pre = d['root']['pre'];
                $scope.process = d['root']['process'];
            });

        $scope.toggleItem = function (item) {
            if ($scope.isItemShown(item)) {
                $scope.shownItem = null;
            } else {
                $scope.shownItem = item;
            }
        };
        $scope.isItemShown = function (item) {
            return $scope.shownItem === item;
        };

    })

    .controller('TakePaymentCtrl', function ($scope, $state, $ionicLoading, $timeout, $ionicHistory, $stateParams,
                                             $cordovaGeolocation, $localstorage, $cordovaDevice, BlueTeam) {
        $scope.data = {};


        $scope.data.name = $localstorage.get('name');
        $scope.data.mobile = parseInt($localstorage.get('mobile'));
        $scope.data.address = $localstorage.get('address');
        $scope.position = {
            "coords": {
                "longitude": null,
                "latitude": null
            }
        };
        // to get current location of the user
        var posOptions = {
            timeout: 1000,
            enableHighAccuracy: false
        };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {

                $scope.position = position;
                console.log(JSON.stringify(position))

            }, function (err) {
                // error
                console.log(JSON.stringify(err));
                $scope.position = {
                    "coords": {
                        "longitude": null,
                        "latitude": null
                    }
                };
            });

        $scope.show = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $timeout(function () {
                $scope.hide();
            }, 5000);

        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };



        // making post api call to the server by using angular based service

        /*
        * {"root":
         {
         "sr_id": "2",
         "amount": "2000",
         "user_id": "10",
         "name": "vikas nagar",
         "mobile": "9560625626",
         "device_id": "sdafd",
         "gps_location": "123.123,1231.13",
         "customer_id": "20",
         "check_no": "31232123"


         }}*/

        $scope.confPayment = function () {
            $scope.show();

            BlueTeam.makePayment({
                    "root": {
                        "name": $scope.data.name,
                        "sr_id": $scope.data.sr_id,
                        "amount": $scope.data.amount,
                        "customer_id": "" + $scope.data.customer_id,
                        "check_no": $scope.data.check_no,
                        "mobile": "" + $scope.data.mobile,
                        "gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,

                        "user_id": $localstorage.get('user_id'),
                        "device_id": $cordovaDevice.getUUID()
                    }
                })
                .then(function (d) {
                    $scope.hide();
                    $ionicHistory.clearHistory();
                    $state.go('finish');
                    //$scope.services = d['data']['services'];
                });
        };

    })

    .controller('F&QCtrl', function ($scope, $state, $ionicHistory, $timeout, $stateParams, BlueTeam) {

        $scope.items = null;

        BlueTeam.getFaq()
            .then(function (d) {

                //$scope.hide();
                //$ionicHistory.clearHistory();
                //$state.go('finish');
                $scope.items = d['root']['faqs'];
            });

        $scope.toggleItem = function (item) {
            if ($scope.isItemShown(item)) {
                $scope.shownItem = null;
            } else {
                $scope.shownItem = item;
            }
        };
        $scope.isItemShown = function (item) {
            return $scope.shownItem === item;
        };


    })
    .controller('TabCtrl', function ($scope, $state, $ionicPopup, $cordovaSocialSharing, $ionicPlatform, $ionicModal, $timeout, $ionicHistory, $localstorage) {

        $ionicPlatform.registerBackButtonAction(function (event) {
            if($state.current.name=="tab.service-list"){
                navigator.app.exitApp();
            }
            else {
                navigator.app.backHistory();
            }
        }, 100);

        $scope.customer = false;
        $scope.type = $localstorage.get('type');
        $scope.name = $localstorage.get('name');
        if($scope.type == "customer")
            $scope.customer = true;
        $scope.logout = function () {
            var logoutConfirmPopup = $ionicPopup.confirm({
                title: 'Confirm Logout',
                template: 'Are you sure to LogOut?'
            });

            logoutConfirmPopup.then(function (res) {
                if (res) {
                    console.log('You are sure');
                    //setObject
                    $localstorage.set('name', "");
                    $localstorage.set('mobile', "");
                    $localstorage.set('email', "");
                    $localstorage.set('type', "");
                    $localstorage.set('user_id', "");

                    $timeout(function () {
                        $ionicHistory.clearCache();
                        $ionicHistory.clearHistory();

                    },300);
                    $state.go('reg');
                } else {
                    console.log('You are not sure');
                }
            });
        };

        // Open the login modal
        $scope.share = function () {
            $cordovaSocialSharing.share("Get relief from Cook/Maid/Driver/Babysitter on leave. " +
                "Book Now on-demand/monthly to get reliable and Blueteam verified worker. " +
                "https://goo.gl/EGxeu3", "Book Now BlueTeam Verified Workers");
        };


    })
    .controller('BookCtrl', function ($scope, $state, $ionicLoading, $timeout, $ionicHistory, $stateParams,
                                      $cordovaGeolocation, $localstorage, $cordovaDevice, BlueTeam) {
        //for datetime picker
        $scope.datetimeValue = new Date();

        $scope.data = {};
        $scope.data.hours = "";

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
        $scope.data.address = $localstorage.get('address');
        $scope.position = {
            "coords": {
                "longitude": null,
                "latitude": null
            }
        };
        // to get current location of the user
        var posOptions = {
            timeout: 1000,
            enableHighAccuracy: false
        };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {

                $scope.position = position;
                console.log(JSON.stringify(position))

            }, function (err) {
                // error
                console.log(JSON.stringify(err));
                $scope.position = {
                    "coords": {
                        "longitude": null,
                        "latitude": null
                    }
                };
            });

        $scope.show = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $timeout(function () {
                $scope.hide();
            }, 5000);

        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };

        $scope.data.startTimeSet = false;

        $scope.takeStartTime = function(){
            $scope.data.startTimeSet = true;
        };
        // making post api call to the server by using angular based service

        $scope.conf = function () {
            if(!$scope.data.startTimeSet) {
                return false;
            }
            $scope.data.startTime = ""+("0"+($scope.datetimeValue.getHours())).slice(-2)
                + ":"+("0"+($scope.datetimeValue.getMinutes())).slice(-2) + ":00";
            $scope.data.endTime = ""+("0"+($scope.datetimeValue.getHours()+parseInt($scope.data.hours))%24 ).slice(-2)
                + ":"+("0"+($scope.datetimeValue.getMinutes())).slice(-2) + ":00";

            $scope.show();
            //$localstorage.set('name', $scope.data.name);
            //$localstorage.set('mobile', $scope.data.mobile);
            $localstorage.set('address', $scope.data.address);
            console.log(JSON.stringify($scope.position));
            BlueTeam.makeServiceRequest({
                    "root": {
                        "name": $scope.data.name,
                        "mobile": "" + $scope.data.mobile,
                        "location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                        "requirements": $scope.service,
                        "user_id": $localstorage.get('user_id'),
                        "start_datatime": $scope.datetimeValue+"",
                        "service_type": $scope.type,
                        "remarks": $scope.type + " this is request by mobile app",
                        "start_time": $scope.data.startTime,
                        "end_time": $scope.data.endTime,
                        "address": $scope.data.address,
                        "priority": "" + 3,
                        "device_id": $cordovaDevice.getUUID()
                    }
                })
                .then(function (d) {
                    $scope.hide();
                    $ionicHistory.clearHistory();
                    $state.go('finish');
                    //$scope.services = d['data']['services'];
                });
        };

    });