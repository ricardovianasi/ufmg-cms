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
                    controllerAs: 'vm',
                    resolve: {
                        isLogged: ['sessionService', function (sessionService) {
                            return sessionService.getIsLogged();
                        }],
                        tokenIsExpired: ['sessionService', '$rootScope', function (sessionService, $rootScope) {
                            if (sessionService.verifyTokenIsExpired())
                                $rootScope.logout();
                        }]
                    }
                });
        });
})();
