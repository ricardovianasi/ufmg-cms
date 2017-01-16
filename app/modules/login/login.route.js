(function () {
    'use strict';

    angular
        .module('loginModule')
        /** ngInject */
        .config(function ($routeProvider) {
            $routeProvider
                .when('/login', {
                    templateUrl: 'modules/login/login.template.html',
                    controller: 'LoginController as vm',
                });
        });
})();
