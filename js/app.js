'use strict'

/* Nutrition App Module */

angular.module('nutrition', ['nutritionControllers']).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/food', {templateUrl: 'partials/food.html', controller: 'FoodCtrl'}).
            otherwise({redirectTo: '/food'});
    }]);