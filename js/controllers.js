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
    controller('MealDetailList', ['$scope', function($scope) {

    }]);