// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.services','starter.controllers','ngCordova','ngMessages','ion-datetime-picker','ionic.rating'])

    .run(function($ionicPlatform) {
      $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
          // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
          // for form inputs)
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

          // Don't remove this line unless you know what you are doing. It stops the viewport
          // from snapping when text inputs are focused. Ionic handles this internally for
          // a much nicer keyboard experience.
          cordova.plugins.Keyboard.disableScroll(true);
        }
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }
      });
    })
    .config(function($stateProvider, $urlRouterProvider) {

      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js

      console.log("state provider: ", JSON.stringify($stateProvider),"URL Route provider: ", JSON.stringify($urlRouterProvider));
      $stateProvider

      // setup an abstract state for the tabs directive
          .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html',
            controller: 'TabCtrl'
          })

          // Each tab has its own nav history stack:

          .state('reg', {
            url: '/reg',


            templateUrl: 'register.html',
            controller: 'RegCtrl'


          })

          .state('tab.contact-us', {

            url: '/contact-us',
            views: {
              'service-list': {
                templateUrl: 'templates/contact-us.html',
                controller: 'ContactUsCtrl'
              }
            }

          })

          .state('tab.digieye', {

            url: '/digieye',
            views: {
              'service-list': {
                templateUrl: 'templates/digieye.html',
                controller: 'DigieyeCtrl'
              }
            }

          })

          .state('tab.register-worker', {

            url: '/register-worker',
            views: {
              'service-list': {
                templateUrl: 'templates/register-worker.html',
                controller: 'DigieyeCtrl'
              }
            }

          })

          .state('tab.view-workers', {

            url: '/view-workers',
            views: {
              'service-list': {
                templateUrl: 'templates/view-workers.html',
                controller: 'VWCtrl'
              }
            }

          })

          .state('tab.service-list', {
            url: '/service-list',
            views: {
              'service-list': {
                templateUrl: 'templates/service-list.html',
                controller: 'ServiceListCtrl'
              }
            }
          })


          .state('tab.map', {
            url: '/map/service/:id/:name/type/:type/catagory_img/:img',
            views: {
              'service-list': {
                templateUrl: 'templates/map.html',
                controller: 'MapCtrl'
              }
            }
          })



          .state('tab.F&Q', {
            url: '/F&Q',
            views: {
              'information': {
                templateUrl: 'templates/f&qs.html',
                controller: 'F&QCtrl'
              }
            }
          })

          .state('tab.about', {
            url: '/about',
            views: {
              'information': {
                templateUrl: 'templates/about.html',
                controller: 'AboutCtrl'
              }
            }
          })



          .state('tab.feedback', {
            url: '/feedback',
            views: {
              'information': {
                templateUrl: 'templates/feedback.html',
                controller: 'FeedbackCtrl'
              }
            }
          })

          .state('tab.t&c', {
            url: '/t&c',
            views: {
              'information': {
                templateUrl: 'templates/t&c.html',
                controller: 'T&CCtrl'
              }
            }
          })


          .state('tab.service-requests', {
            url: '/service-requests',
            views: {
              'information': {
                templateUrl: 'templates/service-requests.html',
                controller: 'ServiceRequestCtrl'
              }
            }
          })



          .state('tab.service-type', {
            url: '/service-list/:id/:name/catagory_img/:img/lat/:lat/lng/:lng',
            views: {
              'service-type': {
                templateUrl: 'templates/service-type.html',
                controller: 'ServiceTypeCtrl'
              }
            }
          })

          .state('tab.blueteam_verified', {
            url: '/blueteam_verified',
            views: {
              'information': {
                templateUrl: 'templates/blueteam_verified.html',
                controller: 'BlueteamVerifiedTypeCtrl'
              }
            }
          })

          .state('tab.book', {
            url: '/service/:name/:id/type/:type/service_provider/:serviceProviderId',
            views: {
              'book': {
                templateUrl: 'templates/book.html',
                controller: 'BookCtrl'
              }
            }
          })

          .state('finish', {
            url: '/finish',

            templateUrl: 'finish.html',
            controller: 'FinishCtrl'


          })

          .state('tab.addworker', {
            url: '/addworker',
            views: {
              'information': {
                templateUrl: 'templates/add-worker.html',
                controller: 'AddWorkerCtrl'
              }
            }
          })



          .state('tab.seerequest', {
            url: '/seerequest',
            views: {
              'information': {
                templateUrl: 'templates/see-request.html',
                controller: 'SeeRequestCtrl'
              }
            }
          })



      ;

      // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/service-list');
      //$urlRouterProvider.otherwise('/tab/worker-timer');
    });
