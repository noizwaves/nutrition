'use strict'

/* Services */

angular.module('nutritionServices', ['nutritionModels']).
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
    }]).
    factory('MealList', ['localStorageService', function(localStorageService) {
        var items = localStorageService.parseJson(localStorageService.get('meals') || "{\"meals\": []}").meals;

        var store = function() {
            localStorageService.add('meals', localStorageService.stringifyJson({meals: items}));
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
            store: store
        };
    }]);