'use strict'

/* Controllers */

angular.module('nutritionControllers', ['nutritionServices']).
    controller('HomeCtrl', ['$scope', 'Food', function($scope, Food) {
        $scope.food = Food.query();
    }]).
    controller('BasicFoodListCtrl', ['$scope', function($scope) {
        $scope.basicNutrients = ['energy','protein','fat','carbohydrate'];
    }]).
    controller('FoodItemCtrl', ['$scope', 'Nutrient', function($scope, Nutrient) {
        var food = $scope.f;
        var nutrients = food['nutrition-per-100g'] || food['nutrition-per-100ml'] || {};

        $scope.getAmount = function(nutrient) {
            return nutrients[nutrient] || '-';
        };
    }]);