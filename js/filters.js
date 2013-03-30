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
    });
