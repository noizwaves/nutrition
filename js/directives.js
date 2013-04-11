'use strict'

angular.module('nutritionDirectives', ['nutritionControllers'])
    .directive('nuFoodTags', function() {
        // Maximum one instance of each tag
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                tags: '=nuTags'
            },
            template: '<span ng-repeat="tag in tags"><span class="badge badge-info">{{tag}}</span>&nbsp;</span>'
        };
    }).
    directive('nuMealTags', function() {
        // Can have multiple instnaces of a tag
        return {
            restrict: 'AE',
            replace: true,
            isolated: true,
            controller: 'MealTagCtrl',
            template: '<span ng-repeat="tag in tags | unique"><span ng-controller="TagCtrl" class="badge" ng-class="(isMultiple && \'badge-important\') || \'badge-info\'">{{label}}</span>&nbsp;</span>'
        };
    }).
    directive('nuFoodNutrition', function() {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                food: '=nuFood',
                nutrient: '=nuNutrient'
            },
            template: '<span>{{getAmount() | number:getPrecision()}}{{getUnit()}}</span>',
            controller: 'FoodNutritionCtrl'
        };
    });
