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

        $scope.getPrecision = function(nutrient) {
            return nutrient.precision || 0;
        };

        $scope.getUnit = function(nutrient) {
            return nutrient.unit || '';
        };

        $scope.getAmount = function(nutrient) {
            return nutrients[nutrient.id] || '-';
        };
    }]).
    controller('MealListCtrl', ['$scope', 'Food', 'localStorageService', function($scope, Food, localStorageService) {
        $scope.meals = localStorageService.parseJson(localStorageService.get('meals') || "{\"meals\": []}").meals;

        $scope.addMeal = function() {
            $scope.meals.push({
                name: '',
                ingredients: []
            });

            $scope.storeMeals();
        };

        $scope.storeMeals = function() {
            var data = {meals: $scope.meals};
            // TODO: remove Food Resources from meal objects, as these break stringifying rules
            localStorageService.add('meals', localStorageService.stringifyJson(data));
        };
    }]).
    controller('MealIngredientListCtrl', ['$scope', 'Food', function($scope, Food) {
        $scope.mode = 'list';
        $scope.food = Food.query(function(foods) {
            $scope.ingredients = [];
            angular.forEach(foods, function(food) {
                // Initial ingredients sync from meal
                var amount = undefined;
                angular.forEach($scope.meal.ingredients, function(i) {
                    if (angular.equals(i.food, food.id)) {
                        amount = i.amount;
                    }
                });

                $scope.ingredients.push({
                    food: food,
                    amount: amount
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
                        $scope.meal.ingredients.push({
                            food: ing.food.id,
                            amount: ing.amount
                        });
                    }
                });
                $scope.storeMeals();
            } else {
                angular.forEach($scope.ingredients, function(i) {
                    var inMeal = false;
                    var amount;
                    angular.forEach($scope.meal.ingredients, function(i2) {
                        if (angular.equals(i.food.id, i2.food)) {
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

        $scope.getFood = function(id) {
            var food = null;
            angular.forEach($scope.food, function(f) {
                if (angular.equals(f.id, id)) {
                    food = f;
                }
            });
            return food;
        };

        $scope.getFoodAmountUnit = function(id) {
            var food = $scope.getFood(id);
            if (!food) return;

            if ('nutrition-per-100g' in food) {
                return 'g';
            } else if ('nutrition-per-100ml' in food) {
                return 'ml';
            } else {
                return '';
            }
        };

        $scope.getFoodName = function(id) {
            var food = $scope.getFood(id);
            if (!food) return;

            return food.name;
        };
    }]).
    controller('IngredientsSummaryCtrl', ['$scope', 'Nutrient', function($scope, Nutrient) {
        $scope.summaryNutrientIds = ['energy', 'protein', 'fat', 'carbohydrate'];

        $scope.nutrients = Nutrient.query();

        $scope.getNutrient = function(id) {
            var nutrient = null;
            angular.forEach($scope.nutrients, function(n) {
                if (angular.equals(id, n.id)) {
                    nutrient = n;
                }
            });
            return nutrient;
        };

        $scope.getPrecision = function(id) {
            var nutrient = $scope.getNutrient(id);
            return (nutrient || {}).precision || 0;
        };

        $scope.getSymbol = function(id) {
            var nutrient = $scope.getNutrient(id);
            return (nutrient || {}).symbol || id;
        };

        $scope.getAmount = function(id) {
            var total = 0;
            angular.forEach($scope.ingredients, function(i) {
                if (i.amount) {
                    var nutrition = i.food['nutrition-per-100g'] || i.food['nutrition-per-100ml'] || {};
                    total += (nutrition[id] || 0) * (i.amount / 100);
                }
            });
            return total;
        };

        $scope.getAmountUnit = function(id) {
            var specific = null;
            angular.forEach($scope.nutrients, function(n) {
                if (angular.equals(n.id, id)) {
                    specific = n;
                }
            });

            return (specific || {}).unit;
        };
    }]).
    controller('MealListNutritionCtrl', ['$scope', '$filter', 'Nutrient', 'Food', function($scope, $filter, Nutrient, Food) {
        // TODO: now this feels even more copy and pasty...!
        $scope.totalNutrientIds = ['energy', 'protein', 'fat', 'carbohydrate'];
        $scope.totalNutrientIdsGrouped = ($filter('ngroup'))($scope.totalNutrientIds, 4);

        $scope.nutrients = Nutrient.query();

        $scope.getNutrient = function(id) {
            var nutrient = null;
            angular.forEach($scope.nutrients, function(n) {
                if (angular.equals(id, n.id)) {
                    nutrient = n;
                }
            });
            return nutrient;
        };

        $scope.getPrecision = function(id) {
            var nutrient = $scope.getNutrient(id);
            return (nutrient || {}).precision || 0;
        };

        $scope.getName = function(id) {
            var nutrient = $scope.getNutrient(id);
            return (nutrient || {}).name || id;
        };

        $scope.food = Food.query();

        $scope.getFood = function(id) {
            var food = null;
            angular.forEach($scope.food, function(f) {
                if (angular.equals(f.id, id)) {
                    food = f;
                }
            });
            return food;
        };

        $scope.getTotal = function(id) {
            var total = 0;
            angular.forEach($scope.meals, function(m) {
                angular.forEach(m.ingredients, function(i) {
                    if (i.amount) {
                        var food = $scope.getFood(i.food);
                        if (food === null) return;
                        var nutrition = food['nutrition-per-100g'] || food['nutrition-per-100ml'] || {};
                        total += (nutrition[id] || 0) * (i.amount / 100);
                    }
                });
            });
            return total;
        };

        $scope.getAmountUnit = function(id) {
            var specific = null;
            angular.forEach($scope.nutrients, function(n) {
                if (angular.equals(n.id, id)) {
                    specific = n;
                }
            });

            return (specific || {}).unit;
        };
    }]);