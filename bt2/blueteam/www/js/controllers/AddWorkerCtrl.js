/**
 * Created by spider-ninja on 12/12/16.
 */
angular.module('starter.controllers')
    .controller('AddWorkerCtrl', function ($scope, $state, $ionicLoading, $timeout, $ionicHistory, $stateParams,
                                           $cordovaGeolocation, $localstorage, $cordovaDevice, $cordovaBarcodeScanner,
                                           $cordovaFileTransfer, $cordovaCamera, BlueTeam) {

        $scope.slots = [
            {epochTime: 12600, step: 15, format: 12},
            {epochTime: 54900, step: 1, format: 24}
        ];

        $scope.data = {};


        $scope.type = $localstorage.get('type');


        $scope.customer = true;
        if ($scope.type == "cem") {
            $scope.cem = true;
            $scope.customer = false;
        }


        $scope.data.hours = "";
        $scope.selectedTime = new Date();
        $scope.selectedTime.setHours(7);
        $scope.data.time = ("0" + ($scope.selectedTime.getHours() % 12)).slice(-2) + ':'
            + "00" + " "
            + (($scope.selectedTime.getHours() > 12) ? "PM" : "AM");
        $scope.data.time24 = "";

        $scope.timePickerCallback = function (val) {
            if (typeof (val) === 'undefined') {
                console.log('Time not selected');
            } else {
                var selectedTime = $scope.selectedTime = new Date(val * 1000);
                console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
                $scope.data.time24 = ("0" + selectedTime.getUTCHours()).slice(-2) + ':' + ("0" + selectedTime.getUTCMinutes()).slice(-2) + ':00';
                $scope.data.time = ("0" + (parseInt(selectedTime.getUTCHours()) % 12)).slice(-2) + ':' + ("0" + selectedTime.getUTCMinutes()).slice(-2) + " " + ((selectedTime.getUTCHours() > 12) ? "PM" : "AM");
                console.log($scope.data.time24);
            }
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


        $scope.timePickerObject = {
            inputEpochTime: (7 * 60 * 60),  //Optional
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

        $scope.timeClicked = false;

        $scope.timeSet = function () {
            $scope.timeClicked = true;
        };

        $scope.show();
        BlueTeam.getServices("?type=monthly").then(function (d) {

            $ionicHistory.clearHistory();
            $scope.montlhyServices = d['root'];
            console.log(JSON.stringify($scope.montlhyServices));
            $scope.hide();
        });

        // making post api call to the server by using angular based service

        $scope.addWorker = function () {

            $scope.show();


            BlueTeam.postWorker(
                {
                    "root": {
                        "name": $scope.data.name,
                        "mobile": $scope.data.mobile,
                        "email": "",
                        "type1": $scope.data.type,
                        "address": $scope.data.address,
                        "gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                        /*"device_id": $cordovaDevice.getUUID(),*/
                        "ref_id": $localstorage.get('user_id'),
                        "emergency_no": $scope.data.emergency_mobile,
                        "native_place": $scope.data.native_place,
                        "native_add": $scope.data.native_add,
                        "dob": $scope.data.dob,
                        "education": $scope.data.education,
                        "experience": $scope.data.experience,
                        "gender": $scope.data.gender,
                        "remark": $scope.data.remark,
                        "salary": $scope.data.salary,
                        "bonus": $scope.data.bonus,
                        "timings": [
                            {
                                "start_time": $scope.data.startTime,
                                "end_time": $scope.data.startTime
                            }
                        ],
                        "services": [2, 3, 4]

                    }
                }
                )
                .then(function (d) {
                    $scope.hide();

                    $scope.resp = d['root'].user;
                    if ($scope.resp == "")
                        alert("Failed! User already exists");
                    else {
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

    });
