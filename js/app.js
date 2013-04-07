'use strict'

/* Nutrition App Module */

angular.module('nutrition', ['nutritionControllers', 'nutritionFilters', 'nutritionDirectives', 'nutritionServices', 'LocalStorageModule']).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/food', {templateUrl: 'partials/food.html', controller: 'FoodCtrl'}).
            when('/meals', {templateUrl: 'partials/meals.html'}).
            otherwise({redirectTo: '/food'});
    }]);