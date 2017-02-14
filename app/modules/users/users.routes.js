(function () {
    'use strict';

    angular.module('usersModule')
        /** ngInject */
        .config(function ($routeProvider) {
            $routeProvider
                .when('/users', {
                    templateUrl: 'modules/users/users.html',
                    controller: 'UsersController',
                    controllerAs: 'vm',
                    resolve: {
                        isLogged: ['sessionService', function (sessionService) {
                            return sessionService.getIsLogged();
                        }],
                        tokenIsExpired: ['sessionService', '$rootScope', function (sessionService, $rootScope) {
                            if (sessionService.verifyTokenIsExpired()) {
                                $rootScope.logout();
                            }
                        }]
                    }
                })
                .when('/users/new', {
                    templateUrl: 'modules/users/users.actions.html',
                    controller: 'UsersActionsController',
                    // templateUrl: 'modules/users/users-new.template.html',
                    // controller: 'UsersNewController',
                    controllerAs: 'vm',
                    resolve: {
                        isLogged: ['sessionService', function (sessionService) {
                            return sessionService.getIsLogged();
                        }],
                        tokenIsExpired: ['sessionService', '$rootScope', function (sessionService, $rootScope) {
                            if (sessionService.verifyTokenIsExpired()) {
                                $rootScope.logout();
                            }
                        }]
                    }
                })
                .when('/user/edit/:userId', {
                    templateUrl: 'modules/users/users-new.template.html',
                    controller: 'UsersNewController',
                    // templateUrl: 'modules/users/users.actions.html',
                    // controller: 'UsersActionsController',
                    controllerAs: 'vm',
                    resolve: {
                        isLogged: ['sessionService', function (sessionService) {
                            return sessionService.getIsLogged();
                        }],
                        tokenIsExpired: ['sessionService', '$rootScope', function (sessionService, $rootScope) {
                            if (sessionService.verifyTokenIsExpired()) {
                                $rootScope.logout();
                            }
                        }]
                    }
                });
        });
})();
