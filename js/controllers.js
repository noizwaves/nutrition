'use strict'

/* Controllers */

angular.module('nutritionControllers', ['nutritionServices', 'nutritionFilters']).
    controller('FoodListCtrl', ['$scope', 'FoodList', 'NutrientList', function($scope, FoodList, NutrientList) {
        $scope.food = FoodList.list;
        $scope.nutrients = NutrientList.list;
    }]).
    controller('FoodNutritionCtrl', ['$scope', function($scope) {
        var getNutrition = function() {
            var food = $scope.food;
            return food['nutrition-per-100g'] || food['nutrition-per-100ml'] || {};
        };

        $scope.getPrecision = function() {
            return $scope.nutrient.precision || 0;
        };

        $scope.getUnit = function() {
            return $scope.nutrient.unit || '';
        };

        $scope.getAmount = function() {
            return getNutrition()[$scope.nutrient.id] || '-';
        };
    }]).
    controller('MealListCtrl', ['$scope', 'MealList', function($scope, MealList) {
        $scope.meals = MealList.list;
        $scope.addMeal = MealList.add;
        $scope.removeMeal = MealList.remove;
        $scope.removeAllMeals = MealList.clear;
        $scope.storeMeals = MealList.store;
    }]).
    controller('MealIngredientListCtrl', ['$scope', '$filter', 'Food', function($scope, $filter, Food) {
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

        $scope.gotoList = function() {
            $scope.mode = 'list';
        };

        $scope.gotoDetailFromList = function() {
            $scope.mode = 'detail';
        };

        $scope.gotoDetailFromEdit = function() {
            $scope.mode = 'detail';

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
        };

        $scope.gotoEdit = function() {
            $scope.mode = 'edit';

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

        $scope.getTags = function() {
            var output = [];
            angular.forEach($scope.ingredients, function(i) {
                if (angular.isNumber(i.amount)) {
                    output.push.apply(output, i.food.tags || []);
                }
            });
            return output;
        };

        $scope.getTagCount = function(tag) {
            var count = 0;
            angular.forEach($scope.ingredients, function(i) {
                if (angular.isNumber(i.amount)) {
                    angular.forEach(i.food.tags, function(t) {
                        if (angular.equals(tag, t)) {
                            count++;
                        }
                    });
                }
            });
            return count;
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
            angular.forEach($scope.meals(), function(m) {
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
    }]).
    controller('TagCtrl', ['$scope', 'MealList', function($scope, MealList) {
        $scope.$watch(function() {
            return MealList.timestamp();
        }, function(newValue, oldValue) {
            var tag = $scope.tag;
            $scope.label = $scope.tag;
            $scope.isMultiple = $scope.getTagCount(tag) != 1;
            if ($scope.getTagCount(tag) != 1) {
                $scope.label += " x " + $scope.getTagCount(tag);
            }
        });
    }]).
    controller('MealTagCtrl', ['$scope', 'MealList', 'FoodList', function($scope, MealList, FoodList) {
        $scope.tags = [];

        $scope.getTagCount = function(tag) {
            var count = 0;
            angular.forEach($scope.tags, function(t) {
                if (angular.equals(tag, t)) {
                    count++;
                }
            });
            return count;
        };

        var getFood = function(id) {
            var food = null;
            angular.forEach(FoodList.list(), function(f) {
                if (angular.equals(f.id, id)) {
                    food = f;
                }
            });
            return food;
        };

        $scope.$watch(function() {
            // If meals are changed, or when Food loads
            return MealList.timestamp() + FoodList.timestamp();
        }, function(newValue, oldValue) {
            // Meals have changed
            var tags = [];
            angular.forEach(MealList.list(), function(meal) {
                angular.forEach(meal.ingredients, function(i) {
                    var food = getFood(i.food);
                    if (food) {
                        tags.push.apply(tags, food.tags || []);
                    }
                });
            });
            $scope.tags = tags;
        });
    }]);