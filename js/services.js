'use strict'

/* Data Services */

var module = angular.module('nutritionServices', ['ngResource']);
module.
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

/* Services */
module.
    factory('FoodList', ['Food', function(Food) {
        var items = Food.query();

        return {
            list: function() {
                return items;
            }
        };
    }]).
    factory('NutrientList', ['Nutrient', function(Nutrient) {
        var items = Nutrient.query();

        return {
            list: function() {
                return items;
            }
        };
    }]);