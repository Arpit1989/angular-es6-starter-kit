/**
 * Created by gurpreet2217 on 12/1/2015.
 */
require('angular');

var starterApp = angular.module('starterApp', []);

starterApp.controller('AboutCtrl', function ($scope) {
    $scope.name = 'John Doe';
});