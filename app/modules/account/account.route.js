(function () {
    'use strict';

    angular
        .module('accountModule')
        /** ngInject */
        .config(function ($routeProvider) {
            $routeProvider
                .when('/profile', {
                    templateUrl: 'modules/account/account.template.html',
                    controller: 'AccountController',
                    controllerAs: 'vm'
                });
        });
})();
