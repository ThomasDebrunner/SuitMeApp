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
    'ngTouch',
    'vModal'
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
}).factory('detailModal', function (vModal) {
  return vModal({
    controller: 'DetailModalController',
    controllerAs: 'ModalController',
    templateUrl: 'views/detailmodal.html'
    
  });
});

