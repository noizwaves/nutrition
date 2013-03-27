'use strict'

/* Controllers */

angular.module('nutritionControllers', ['nutritionServices']).
    controller('HomeCtrl', ['$scope', 'Food', function($scope, Food) {
        $scope.food = Food.query();
    }]);