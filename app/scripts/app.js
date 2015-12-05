'use strict';

/**
 * @ngdoc overview
 * @name fashionMeAppApp
 * @description
 * # fashionMeAppApp
 *
 * Main module of the application.
 */
angular
  .module('suitMeApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .when('/finder', {
        templateUrl: 'views/finder.html',
        controller: 'FinderController',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).config([
    "$routeProvider",
    "$httpProvider",
    function($routeProvider, $httpProvider){
        $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
    }
]);

