(function () {
    'use strict';

    angular
        .module('releasesModule')
        /** ngInject */
        .config(function ($routeProvider) {

            $routeProvider
                .when('/releases', {
                    templateUrl: 'modules/pressOffice/releases/releases.template.html',
                    controller: 'ReleasesController',
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
                .when('/releases/new', {
                    templateUrl: 'modules/pressOffice/releases/releases.form.template.html',
                    controller: 'ReleasesNewController',
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
                            if (!PermissionService.canPost('release')) {
                                $window.location.href = '#/releases';
                            }
                        }]
                    }
                })
                .when('/releases/edit/:id', {
                    templateUrl: 'modules/pressOffice/releases/releases.form.template.html',
                    controller: 'ReleasesEditController',
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
                        permission: ['PermissionService', '$window', '$routeParams', function (PermissionService, $window, $routeParams) {
                            if (!PermissionService.canPut('release', $routeParams.id)) {
                                $window.location.href = '#/releases';
                            }
                        }]
                    }
                });
        });
})();
