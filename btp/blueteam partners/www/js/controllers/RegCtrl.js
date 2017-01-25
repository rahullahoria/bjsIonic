/**
 * Created by spider-ninja on 11/27/16.
 */
angular.module('starter.controllers')


    .controller('RegCtrl', function ($scope, $state, $ionicLoading, $timeout, $ionicHistory, $cordovaGeolocation, $localstorage,
                                     $ionicPlatform, $cordovaDevice, $ionicPopup, $window, $cordovaLocalNotification, $cordovaNetwork, $cordovaCamera, BlueTeam) {


        console.log("regcont started");

        //photo,name,mobile,password,address,experience,services,city,area

        $scope.user = {};
        $scope.data = {};
        $scope.v = {};
        $scope.v.mobile = false;
        $scope.v.password = false;
        $scope.v.conf_password = false;
        $scope.v.name = false;

        $scope.v.experience = false;
        $scope.v.services = false;


        console.log('reg',register.mobile.$invalid,$scope.v.mobile);
        $scope.registered = true;
        $scope.checked = false;

        $scope.user.profile_pic_id = 0;
        $scope.user.area_id = 0;
        $scope.user.city_id = 0;

        $scope.goReg = true;
        $scope.goLogin = false;
        $scope.valIP = function(){


            if($scope.user.mobile  != undefined){
                $scope.v.mobile = $scope.goLogin = true;
            }else
                $scope.v.mobile = $scope.goLogin = false;
            if($scope.user.password  != undefined){
                $scope.v.password = $scope.goLogin = true;
            }else
                $scope.v.password = $scope.goLogin = false;
            if(!$scope.registered){

                if($scope.user.conf_password  != undefined && $scope.user.password == $scope.user.conf_password){

                    $scope.v.conf_password =  $scope.goReg = true;
                }else
                    $scope.v.conf_password = $scope.goReg = false;
                if($scope.user.name  != undefined){
                    $scope.v.name = $scope.goReg = true;
                }else
                    $scope.v.name = $scope.goReg = false;
                if($scope.user.experience  != undefined){
                    $scope.v.experience = $scope.goReg = true;
                }else
                    $scope.v.experience = $scope.goReg = false;
                if($scope.user.services  != undefined && $scope.user.services.length != 0){

                    $scope.v.services = $scope.goReg = true;
                }else
                    $scope.v.services = $scope.goReg = false;
            }

        };



        $scope.position = {
            "coords": {
                "longitude": null,
                "latitude": null
            }
        };

        var posOptions = {
            "enableHighAccuracy": false,
            "timeout": 60000,
            "maximumAge": 0
        };



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

                    "gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                    "mobile": $scope.user.mobile,
                    "password": $scope.user.password,
                    "device_id": $cordovaDevice.getUUID()


                })
                .then(function (d) {

                    //setObject
                    $scope.hide();

                    if (d.user.id) {

                        if(d.user.lat && d.user.lat != "" && d.user.lat != null)
                        d.user.gps_location = d.user.lat+","+ d.user.lng;

                        $localstorage.set('user', JSON.stringify(d.user));
                        $localstorage.set('user_id', d.user.id);
                        $localstorage.set('services', JSON.stringify(d.user.services));

                        $timeout(function () {
                            $window.location.reload(true);
                        }, 2000);
                        $state.go('tab.service-list');



                    } else {
                        $scope.pwdError = true;
                    }

                });


        }
        $scope.checkReg = function () {
            $scope.valIP();
            console.log("trying to check");
            if ($scope.checked == false && $scope.user.mobile != undefined) {
                $scope.checked = true;
                BlueTeam.checkMobile($scope.user.mobile)
                    .then(function (d) {

                        console.log(d.status);
                        if(d.status == false){
                            //register.experience.$invalid = false;
                            BlueTeam.getServiceProviderServices("").then(function (d) {


                                $scope.serviceProviders = d.allServices;
                                console.log(JSON.stringify($scope.serviceProviders));

                            });



                            /*
                             BlueTeam.getCities().then(function (d) {
                             console.log($scope.position.coords.latitude + ',' + $scope.position.coords.longitude);
                             if($scope.position.coords.latitude)
                             BlueTeam.getLocationDetails($scope.position.coords.latitude + ',' + $scope.position.coords.longitude).then(function (d) {
                             $scope.user.city_id = d.location_details.city.id;
                             $scope.user.area_id = d.location_details.area.id;
                             BlueTeam.getCityAreas($scope.user.city_id).then(function (d) {

                             $scope.areas = d.areas;

                             console.log(JSON.stringify($scope.areas));

                             });

                             });

                             $scope.cities = d.cities;
                             console.log(JSON.stringify($scope.serviceProviders));

                             });
                             */
                        }
                        $scope.registered = d.status;

                    });


            }
            /*else $scope.data.password = "";*/
        };
        $scope.pwdError = false;
        $scope.checkSamePwd = function () {

            if ($scope.user.password != $scope.user.conf_password) {
                $scope.pwdError = true;
            }
            $scope.pwdError = false;


        };



        $ionicPlatform.ready(function () {
            /* if($scope.geolocation) {
             var locationService = $scope.geolocation; // native HTML5 geolocation
             }
             else {
             var locationService = navigator.geolocation; // cordova geolocation plugin
             }

             locationService.getCurrentPosition(
             function(pos) {
             console.log("location inv",JSON.stringify(pos));

             },
             function(error) {
             console.log("location inv",JSON.stringify(error.__proto__.message))

             },
             {enableHighAccuracy: false, timeout: 15000}
             );

             var options = { enableHighAccuracy: false };

             console.log("location by nav",JSON.stringify(
             navigator.geolocation.getCurrentPosition(function (position) {


             $scope.position = position;
             console.log("location by navigator",JSON.stringify(position));


             }, function (err) {

             console.log("error in geting location by navigator",err,JSON.stringify(err.message));
             $scope.position = {
             "coords": {
             "longitude": null,
             "latitude": null
             }
             };


             }, options)));

             */
            cordova.plugins.diagnostic.isLocationEnabled(function(enabled){
                console.log("Location setting is " + (enabled ? "enabled" : "disabled"));
            }, function(error){
                console.error("The following error occurred: "+error);
            });
            cordova.plugins.diagnostic.isLocationAuthorized(function(authorized){
                console.log("Location is " + (authorized ? "authorized" : "unauthorized"));
            }, function(error){
                console.error("The following error occurred: "+error);
            });
            cordova.plugins.diagnostic.isLocationAvailable(function(available){
                console.log("Location is " + (available ? "available" : "not available"));
                $cordovaGeolocation
                    .getCurrentPosition(posOptions)
                    .then(function (position) {


                        $scope.position = position;
                        console.log("location",JSON.stringify(position));


                    }, function (err) {

                        console.log("error in geting location",err,JSON.stringify(err.message));
                        $scope.position = {
                            "coords": {
                                "longitude": null,
                                "latitude": null
                            }
                        };


                    });
                /*var watchOptions = {
                 timeout : 3000,
                 enableHighAccuracy: true // may cause errors if true
                 };

                 var watch = $cordovaGeolocation.watchPosition(watchOptions);
                 watch.then(
                 null,
                 function(err) {
                 console.log("error in geting location",err,JSON.stringify(err));
                 // error
                 },
                 function(position) {
                 $scope.position = position;

                 console.log("location",JSON.stringify(position));
                 var lat  = position.coords.latitude;
                 var long = position.coords.longitude;
                 watch.clearWatch();
                 });

                 */

            }, function(error){
                console.error("The following error occurred: "+error);
            });

            if ($cordovaNetwork.isOffline()) {

                $ionicPopup.confirm({

                    title: "Internet is not working",

                    content: "Internet is not working on your device."

                });

            }
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


        });

        if ($localstorage.get('user_id') !== undefined && $localstorage.get('user_id') !== "") {
            $scope.user = JSON.parse($localstorage.get('user'));
            $scope.user.mobile = $scope.user.mobile*1;
            $scope.user.experience = $scope.user.experience*1;
            console.log(JSON.stringify($scope.user));
            $scope.user_id = $localstorage.get('user_id');
            $scope.services = JSON.parse($localstorage.get('services'));
            if($scope.user.gps_location)
                $state.go('tab.service-list');
            else
                $state.go('map');
        }


        if ($localstorage.get('name') === undefined || $localstorage.get('mobile') === undefined || $localstorage.get('email') === undefined ||
            $localstorage.get('name') === "" || $localstorage.get('mobile') === "") {

        } else {
            $ionicHistory.clearHistory();
            if ($localstorage.get('type') == "worker")
                $state.go('tab.worker-timer');
            else
                $state.go('tab.service-list');
        }


        $scope.data = {"ImageURI": "Select Image"};
        $scope.takePicture = function () {
            console.log("take Pic Got clicked");

            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URL,
                sourceType: Camera.PictureSourceType.CAMERA
            };
            $cordovaCamera.getPicture(options).then(
                function (imageData) {
                    $scope.picData = imageData;
                    $scope.ftLoad = true;
                    $localstorage.set('fotoUp', imageData);

                    $ionicLoading.show({template: 'wait...', duration: 500});
                    $scope.uploadPicture();
                },
                function (err) {
                    $ionicLoading.show({template: 'Error...', duration: 500});
                })
        }

        $scope.selectPicture = function () {



            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY
            };

            $cordovaCamera.getPicture(options).then(
                function (imageURI) {
                    window.resolveLocalFileSystemURL(imageURI, function (fileEntry) {

                        $scope.picData = fileEntry.toURL();
                        $scope.ftLoad = true;
                        $scope.uploadPicture();
                        console.log($scope.picData);
                        //var image = document.getElementById('myImage');
                        //image.src = fileEntry.nativeURL;
                    });
                    $ionicLoading.show({template: 'wait...', duration: 500});
                },
                function (err) {
                    $ionicLoading.show({template: 'error...', duration: 500});
                })
        };

        $scope.uploadPicture = function () {
            $ionicLoading.show({template: 'wait uploading the document, this may take a while ..'});

            var fileURL = $scope.picData;

            var options = new FileUploadOptions();
            options.fileKey = "fileToUpload";
            options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1) + ".jpg";
            options.mimeType = "image/jpeg";
            options.chunkedMode = true;

            var params = {};
            params.username = "rahul";
            params.password = "rahul";

            options.params = params;

            var ft = new FileTransfer();
            ft.upload(
                fileURL,
                encodeURI("http://api.file-dog.shatkonlabs.com/files/rahul"),
                viewUploadedPictures,
                function (error) {
                    $ionicLoading.show({
                        template: 'Something went wrong ...'
                    });
                    $ionicLoading.hide();
                },
                options);
        };
        var viewUploadedPictures = function (response) {
            console.log(JSON.stringify(response), "hi", response.response);
            $ionicLoading.show({template: 'trying to load the pic ...'});
            server = "http://api.file-dog.shatkonlabs.com/files/rahul/" + JSON.parse(response.response).file.id;

            $scope.user.profile_pic_id = JSON.parse(response.response).file.id;

            $scope.picData = server;
            $scope.ftLoad = true;
            console.log($scope.picData);

            $ionicLoading.hide();
        }

        $scope.basicRegDone = false;
        $scope.userServices = [];

        $scope.regUserServices = function(){


            BlueTeam.regUserServices($scope.user.id,$scope.userServices)
                .then(function (d) {

                    //setObject
                    $localstorage.set('services', JSON.stringify($scope.userServices));
                    $scope.basicRegDone = true;



                    if(d.error){

                        $scope.error = d.error;

                    }

                    $scope.hide();

                    $state.go('map');

                });
        };


        $scope.regUser = function () {
            if ($scope.checked == false) {
                $scope.checkReg();
                return;
            }
            if ($scope.registered) {
                $scope.login();
                return;
            }


            if ($scope.user.password == $scope.user.conf_password) {
                if($scope.user.organization == undefined || $scope.user.organization.length == 0){
                    $scope.user.organization = $scope.user.name;
                }

                $scope.show();

                $scope.user.location = $scope.position.coords.latitude + ',' + $scope.position.coords.longitude;
                $scope.user.device = null;
                $scope.user.device = $cordovaDevice.getUUID();

                BlueTeam.regUser($scope.user)
                    .then(function (d) {

                        $scope.hide();
                        //setObject
                        $localstorage.set('user', JSON.stringify(d.service_providers));
                        $localstorage.set('user_id', d.service_providers.id);

                        $scope.basicRegDone = true;

                        for(var i=0; i<$scope.user.services.length; i++){

                            for(var j=0;j<$scope.serviceProviders.length;j++){
                                if($scope.serviceProviders[j].id == $scope.user.services[i] ){
                                    var temp = {};
                                    temp.id = $scope.user.services[i];
                                    temp.name = $scope.serviceProviders[j].name;
                                    temp.pic_id = $scope.serviceProviders[j].pic_id;

                                    $scope.userServices.push(temp);

                                }
                            }


                        }
                        console.log(JSON.stringify($scope.userServices));

                        console.log(JSON.stringify(d.service_providers));
                        d.service_providers.mobile = d.service_providers.mobile*1;
                        d.service_providers.experience = d.service_providers.experience*1;

                        $scope.user = d.service_providers;


                        if(d.error){

                            $scope.error = d.error;

                        }


                        /*$timeout(function () {
                         $window.location.reload(true);
                         }, 5000);


                         $state.go('tab.service-list');*/

                    });
            }
            else
                $scope.pwdError = true;
        };
    })

;