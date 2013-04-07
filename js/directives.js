'use strict'

angular.module('nutritionDirectives', ['nutritionControllers'])
    .directive('nuFoodTags', function() {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                tags: '=nuTags'
            },
            template: '<span ng-repeat="tag in tags"><span class="badge badge-info">{{tag}}</span>&nbsp;</span>'
        };
    }).
    directive('nuFoodNutrition', function() {

    });
