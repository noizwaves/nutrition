'use strict'

angular.module('nutritionFilters', []).
    filter('ngroup', function() {
        return function(items, n) {
            var output = [];
            var current = null;
            angular.forEach(items, function(item) {
                if (current === null) {
                    current = [];
                    output.push(current);
                }
                if (current === null || current.length === n) {
                    current = [];
                    output.push(current);
                }

                current.push(item);
            });
            return output;
        };
    }).
    filter('unique', function() {
        /* Returns only unique items from an array */

        return function(items) {
            if (!items) return items;

            var output = [];
            var state = {};
            angular.forEach(items, function(item) {
                if (!(item in state)) {
                    output.push(item);
                    state[item] = null;
                }
            });

            return output;
        };
    }).
    filter('isBasicNutrient', function() {
        /* Returns only those nutrients that are the basic ones */

        var basicNutrients = ['energy','protein','fat','carbohydrate'];

        return function(items) {
            if (!items) return items;

            var output = [];
            angular.forEach(items, function(item) {
                angular.forEach(basicNutrients, function(basic) {
                    if (angular.equals(item.id, basic)) {
                        output.push(item);
                    }
                });
            });

            return output;
        };
    });
