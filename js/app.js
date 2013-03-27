'use strict'

/* Nutrition App Module */

angular.module('nutrition', ['nutritionControllers']).
    config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $locationProvider.
            //hashPrefix("!").
            html5Mode(false);
        $routeProvider.
            when('', {templateUrl: './partials/home.html', controller: 'HomeCtrl'}).
            otherwise({redirectTo: ''});
    }]);