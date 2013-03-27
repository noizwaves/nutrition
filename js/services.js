'use strict'

/* Services */

angular.module('nutritionServices', ['ngResource']).
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
