var app = angular.module('app', ['ngRoute']);
app.config(function ($routeProvider) {
    // configure the routes
    $routeProvider
        .when('/', {
            templateUrl: 'components/inicio/inicio.html',
            controller: 'inicioCtrl'
        })
        .when('/sintactico', {
            templateUrl: 'components/sintactico/sintactico.html',
            controller: 'sintacticoCtrl'
        })
        .when('/semantico', {
            templateUrl: 'components/semantico/semantico.html',
            controller: 'semanticoCtrl'
        })
        .when('/lexico', {
            templateUrl: 'components/lexico/lexico.html',
            controller: 'lexicoCtrl'
        })
        .otherwise({
            templateUrl: '',
            controller: 'indexController'
        });

});
app.controller('indexController', function ($scope) {
});
app.controller('sintacticoCtrl', function ($scope) {
    $scope.titulo = "Sintactico";
});
app.controller('semanticoCtrl', function ($scope) {
    $scope.titulo = "Semantico";
});
app.controller('lexicoCtrl', function ($scope) {
    $scope.titulo = "Lexico";
});
app.controller('inicioCtrl', function ($scope) {
});