/**
 * Created by spider-ninja on 12/12/16.
 */
angular.module('starter.controllers')
    .controller('DigieyeCtrl', function ($scope, $state, $ionicLoading, $timeout, $ionicHistory, $stateParams,
                                         $cordovaGeolocation, $localstorage, $cordovaDevice, $cordovaBarcodeScanner,
                                         $cordovaFileTransfer, $cordovaCamera, BlueTeam) {

        $scope.data = {};


        $scope.type = $localstorage.get('type');


        $scope.customer = true;
        if ($scope.type == "cem") {
            $scope.cem = true;
            $scope.customer = false;
        }

        $scope.scanBarcode = function () {
            $cordovaBarcodeScanner.scan().then(function (imageData) {
                //alert(imageData.text);
                if(imageData.text)
                    BlueTeam.getUserById(imageData.text)
                        .then(function (d) {

                            $scope.QrUser = d['root']['workers'][0];

                            console.log(JSON.stringify($scope.QrUser));
                        })
                        .finally(function () {
                            // Stop the ion-refresher from spinning
                            $scope.$broadcast('scroll.refreshComplete');
                        });

                console.log("Barcode Format -> " + imageData.text);
                console.log("Barcode Format -> " + imageData.format);
                console.log("Cancelled -> " + imageData.cancelled);
            }, function (error) {
                console.log("An error happened -> " + error);
            });
        };

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

        // image upload

        $scope.data = {"ImageURI": "Select Image"};
        $scope.takePicture = function (type1) {
            console.log("take Pic Got clicked", type1);
            $scope.uploadeType = type1;
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

        $scope.selectPicture = function (type1) {

            $scope.uploadeType = type1;

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

        $scope.calculateAge = function calculateAge(birthdayRaw) { // birthday is a date
            var birthday = new Date(birthdayRaw);
            var ageDifMs = Date.now() - birthday.getTime();
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            return Math.abs(ageDate.getUTCFullYear() - 1970);
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

            if($scope.uploadeType == "p") $scope.data.photo = JSON.parse(response.response).file.id;
            if($scope.uploadeType == "vc") $scope.data.voter_card = JSON.parse(response.response).file.id;
            if($scope.uploadeType == "pc") $scope.data.pan_card = JSON.parse(response.response).file.id;
            if($scope.uploadeType == "ac") $scope.data.adhar_card = JSON.parse(response.response).file.id;
            if($scope.uploadeType == "dl") $scope.data.driving_license = JSON.parse(response.response).file.id;

            $scope.picData = server;
            $scope.ftLoad = true;
            console.log($scope.picData);

            $ionicLoading.hide();
        }

        $scope.viewPictures = function () {
            $ionicLoading.show({template: 'Sto cercando le tue foto...'});
            server = "http://www.yourdomain.com/upload.php";
            if (server) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState === 4) {
                        if (xmlhttp.status === 200) {
                            document.getElementById('server_images').innerHTML = xmlhttp.responseText;
                        }
                        else {
                            $ionicLoading.show({template: 'Errore durante il caricamento...', duration: 1000});
                            return false;
                        }
                    }
                };
                xmlhttp.open("GET", server, true);
                xmlhttp.send()
            }
            ;
            $ionicLoading.hide();
        };

        $scope.addWorker = function () {

            $scope.show();


            BlueTeam.postWorker(
                {
                    "root": {
                        "name": $scope.data.name,
                        "mobile": $scope.data.mobile,
                        "photo": $scope.data.photo,
                        "voter_card": $scope.data.voter_card,
                        "pan_card": $scope.data.pan_card,
                        "adhar_card": $scope.data.adhar_card,
                        "driving_license": $scope.data.driving_license,

                        "type1": $scope.data.type,

                        "gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                        /*"device_id": $cordovaDevice.getUUID(),*/
                        "ref_id": $localstorage.get('user_id'),

                        "gender": $scope.data.gender


                    }
                }
                )
                .then(function (d) {
                    $scope.hide();

                    $scope.resp = d['root'].user;
                    if ($scope.resp == "")
                        alert("Failed! User already exists");
                    else {
                        $scope.data.voter_card = "";
                        $scope.data.pan_card = "";
                        $scope.data.adhar_card = "";
                        $scope.data.driving_license = "";
                        $scope.data.name = "";
                        $scope.data.mobile = "";
                        $scope.data.emergency_mobile = "";
                        $scope.data.type = "";
                        $scope.data.address = "";
                        $scope.data.native_place = ""
                        $scope.data.native_add = "";
                        $scope.data.dob = "";
                        $scope.data.education = "";
                        $scope.data.experience = "";
                        $scope.data.gender = "";
                        $scope.data.remark = "";
                        $scope.data.salary = "";
                        $scope.data.bonus = "";

                        alert("Registered Successfuly");

                    }

                });
        };


    })
;