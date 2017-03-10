(function () {
    'use strict';

    angular.module('menuModule')
        .config(MenuModule);
    /** ngInject */
    function MenuModule($routeProvider) {
        $routeProvider
            .when('/menu', {
                templateUrl: 'modules/menu/menu.template.html',
                controller: 'MenuController',
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
    }
})();
