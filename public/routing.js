var app = angular.module('app', ['ngRoute']);
app.config(function ($routeProvider) {
    // configure the routes
    $routeProvider
        .when('/', {
            templateUrl: 'components/inicio/inicio.html',
            controller: 'inicioCtrl'
        })
        .otherwise({
            templateUrl: '',
            controller: 'indexController'
        });

});
app.controller('indexController', function ($scope) {
});
app.controller('inicioCtrl', function ($scope) {
});