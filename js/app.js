'use strict'

/* Nutrition App Module */

angular.module('nutrition', ['nutritionControllers']).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/', {templateUrl: './partials/home.html', controller: 'HomeCtrl'}).
            otherwise({redirectTo: '/'});
    }]);