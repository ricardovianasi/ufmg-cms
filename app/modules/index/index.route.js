(function () {
    'use strict';

    angular
        .module('indexModule')
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'modules/index/index.template.html',
                    controller: 'IndexController',
                    controllerAs: 'ctrl'
                });
        }]);
})();
