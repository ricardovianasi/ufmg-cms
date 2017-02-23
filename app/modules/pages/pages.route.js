(function () {
    'use strict';

    angular.module('pagesModule')
        /** ngInject */
        .config(function ($routeProvider) {
            $routeProvider
                .when('/pages', {
                    templateUrl: 'modules/pages/pages.template.html',
                    controller: 'PagesController',
                    controllerAs: 'ctrl',
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
                .when('/pages/new', {
                    templateUrl: 'modules/pages/pages.form.template.html',
                    controller: 'PagesNewController',
                    controllerAs: 'ctrl',
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
                            if (!PermissionService.canPost('page')) {
                                $window.location.href = '#/pages';
                            }
                        }]
                    }
                })
                .when('/pages/edit/:id', {
                    templateUrl: 'modules/pages/pages.form.template.html',
                    controller: 'PagesEditController',
                    controllerAs: 'ctrl',
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
                            if (!PermissionService.canPut('page')) {
                                $window.location.href = '#/pages';
                            }
                        }]
                    }
                });
        });
})();
