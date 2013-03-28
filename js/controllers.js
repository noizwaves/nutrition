'use strict'

/* Controllers */

angular.module('nutritionControllers', ['nutritionServices']).
    controller('FoodCtrl', ['$scope', 'Food', function($scope, Food) {
        $scope.food = Food.query();
    }]).
    controller('BasicFoodListCtrl', ['$scope', 'Nutrient', function($scope, Nutrient) {
        // TODO: make these Nurtient resources
        var basicNutrients = ['energy','protein','fat','carbohydrate'];

        $scope.nutrients = Nutrient.query();

        $scope.isBasic = function(n) {
            var found = false;
            angular.forEach(basicNutrients, function(bn) {
                found |= angular.equals(bn, n.id);
            });
            return found;
        };
    }]).
    controller('FoodItemCtrl', ['$scope', 'Nutrient', function($scope, Nutrient) {
        var food = $scope.f;
        var nutrients = food['nutrition-per-100g'] || food['nutrition-per-100ml'] || {};

        $scope.getAmount = function(nutrient) {
            return nutrients[nutrient.id] || '-';
        };

        $scope.getUnit = function(nutrient) {
            var specific = null;
            angular.forEach(Nutrient.query(), function(d) {
                if (d.id == nutrient) {
                    specific = d;
                }
            });
            return (specific || {}).unit;
        };
    }]).
    controller('MealListCtrl', ['$scope', 'Food', function($scope, Food) {
        $scope.meals = [];
        $scope.addMeal = function() {
            $scope.meals.push({
                name: '',
                ingredients: []
            });
        };
    }]).
    controller('MealIngredientList', ['$scope', 'Food', function($scope, Food) {
        $scope.mode = 'list';
        Food.query(function(foods) {
            $scope.ingredients = [];
            angular.forEach(foods, function(food) {
                $scope.ingredients.push({
                    food: food
                });
            });
        });

        $scope.toggle = function() {
            var nextMode = angular.equals($scope.mode, 'list') ? 'edit' : 'list';

            // TODO: do this more elegantly
            if (angular.equals(nextMode, 'list')) {
                $scope.meal.ingredients = [];
                angular.forEach($scope.ingredients, function(ing) {
                    if (angular.isNumber(ing.amount)) {
                        $scope.meal.ingredients.push(ing);
                    }
                });
            } else {
                angular.forEach($scope.ingredients, function(i) {
                    var inMeal = false;
                    var amount;
                    angular.forEach($scope.meal.ingredients, function(i2) {
                        if (angular.equals(i, i2)) {
                            amount = i2.amount;
                            inMeal = true;
                        }
                    });
                    if (inMeal) {
                        i.amount = amount;
                    } else {
                        delete i.amount;
                    }
                });
            }

            $scope.mode  = nextMode;
        };

        $scope.getAmountUnit = function(food) {
            return ('nutrition-per-100g' in food) ? 'g' : 'ml';
        };
    }]);