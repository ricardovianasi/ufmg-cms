(function () {
    'use strict';

    angular
        .module('indexModule')
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'modules/index/index.template.html',
                    controller: 'IndexController',
                    controllerAs: 'vm'
                })
                .when('/page-not-found', {
                    templateUrl: 'modules/index/page-not-found.html',
                });
        }]);
})();
