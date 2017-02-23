(function () {
    'use strict';

    angular
        .module('clippingsModule')
        /** ngInject */
        .config(function ($routeProvider) {

            $routeProvider
                .when('/clippings', {
                    templateUrl: 'modules/pressOffice/clippings/clippings.template.html',
                    controller: 'ClippingsController',
                    controllerAs: 'ctrl',
                    resolve: {
                        isLogged: ['sessionService', function (sessionService) {
                            return sessionService.getIsLogged();
                        }],
                        tokenIsExpired: ['sessionService', '$rootScope', function (sessionService, $rootScope) {
                            if (sessionService.verifyTokenIsExpired())
                                $rootScope.logout();
                        }]
                    }
                })
                .when('/clippings/new', {
                    templateUrl: 'modules/pressOffice/clippings/clippings.form.template.html',
                    controller: 'ClippingsNewController',
                    controllerAs: 'ctrl',
                    resolve: {
                        isLogged: ['sessionService', function (sessionService) {
                            return sessionService.getIsLogged();
                        }],
                        tokenIsExpired: ['sessionService', '$rootScope', function (sessionService, $rootScope) {
                            if (sessionService.verifyTokenIsExpired())
                                $rootScope.logout();
                        }],
                        permission: ['PermissionService', '$window', function (PermissionService, $window) {
                            if (!PermissionService.canPost('clipping')) {
                                $window.location.href = '#/clippings';
                            }
                        }]
                    }
                })
                .when('/clippings/edit/:id', {
                    templateUrl: 'modules/pressOffice/clippings/clippings.form.template.html',
                    controller: 'ClippingsEditController',
                    controllerAs: 'ctrl',
                    resolve: {
                        isLogged: ['sessionService', function (sessionService) {
                            return sessionService.getIsLogged();
                        }],
                        tokenIsExpired: ['sessionService', '$rootScope', function (sessionService, $rootScope) {
                            if (sessionService.verifyTokenIsExpired())
                                $rootScope.logout();
                        }],
                        permission: ['PermissionService', '$window', '$routeParams', function (PermissionService, $window, $routeParams) {
                            if (!PermissionService.canPut('clipping', $routeParams.id)) {
                                $window.location.href = '#/clippings';
                            }
                        }]
                    }
                });
        });
})();
