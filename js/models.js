'use strict'

/* Data Services */

angular.module('nutritionModels', ['ngResource']).
    factory('Food', function($resource) {
        return $resource('data/food.json', {}, {
            query: {method:'GET', isArray:true}
        });
    }).
    factory('Nutrient', function($resource) {
        return $resource('data/nutrients.json', {}, {
            query: {method:'GET', isArray:true}
        });
    });