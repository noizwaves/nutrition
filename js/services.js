'use strict'

/* Services */

angular.module('nutritionServices', ['nutritionModels']).
    factory('FoodList', ['Food', function(Food) {
        var timestamp = new Date().getTime();
        var items = Food.query(function() {
            timestamp = new Date().getTime();
        });

        return {
            list: function() {
                return items;
            },
            timestamp: function() {
                return timestamp;
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
    }]).
    factory('MealList', ['localStorageService', function(localStorageService) {
        var items = localStorageService.parseJson(localStorageService.get('meals') || "{\"meals\": []}").meals;
        var timestamp = new Date().getTime();

        var markChanged = function() {
            timestamp = new Date().getTime();
        };

        var store = function() {
            localStorageService.add('meals', localStorageService.stringifyJson({meals: items}));
            markChanged();
        };

        return {
            list: function() {
                return items;
            },
            add: function() {
                items.push({
                    name: '',
                    ingredients: []
                });
                store();
            },
            remove: function(meal) {
                var index = items.indexOf(meal);
                if (index !== -1) {
                    items.splice(index, 1);
                    store();
                }
            },
            clear: function() {
                items = [];
                store();
            },
            store: store,
            timestamp: function() {
                return timestamp;
            }
        };
    }]);