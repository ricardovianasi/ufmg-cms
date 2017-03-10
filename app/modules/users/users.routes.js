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
                    templateUrl: 'modules/users/form/users.form.html',
                    controller: 'UsersFormController',
                    controllerAs: 'vm',
                    resolve: {
                        isLogged: ['sessionService', function (sessionService) {
                            return sessionService.getIsLogged();
                        }],
                        tokenIsExpired: ['sessionService', '$rootScope', function (sessionService, $rootScope) {
                            if (sessionService.verifyTokenIsExpired()) {
                                $rootScope.logout();
                            }
                        }],
                        permission: ['PermissionService', '$window', function (PermissionService, $window) {
                            if (!PermissionService.canPost('user')) {
                                $window.location.href = '#/users';
                            }
                        }]
                    }
                })
                .when('/user/edit/:userId', {
                    templateUrl: 'modules/users/form/users.form.html',
                    controller: 'UsersFormController',
                    controllerAs: 'vm',
                    resolve: {
                        isLogged: ['sessionService', function (sessionService) {
                            return sessionService.getIsLogged();
                        }],
                        tokenIsExpired: ['sessionService', '$rootScope', function (sessionService, $rootScope) {
                            if (sessionService.verifyTokenIsExpired()) {
                                $rootScope.logout();
                            }
                        }],
                        permission: ['PermissionService', '$window', '$routeParams', function (PermissionService, $window, $routeParams) {
                            if (!PermissionService.canPut('user', $routeParams.userId)) {
                                $window.location.href = '#/users';
                            }
                        }]
                    }
                });
        });
})();
