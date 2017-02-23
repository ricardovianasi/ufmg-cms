(function () {
    'use strict';

    angular
        .module('featuredModule')
        /** ngInject */
        .config(function ($routeProvider) {

            $routeProvider
                .when('/featured', {
                    templateUrl: 'modules/pressOffice/featured/featured.template.html',
                    controller: 'featuredController',
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
                })
                .when('/featured/new', {
                    templateUrl: 'modules/pressOffice/featured/featured.form.template.html',
                    controller: 'featuredNewController',
                    controllerAs: 'vm',
                    resolve: {
                        isLogged: ['sessionService', function (sessionService) {
                            return sessionService.getIsLogged();
                        }],
                        tokenIsExpired: ['sessionService', '$rootScope', function (sessionService, $rootScope) {
                            if (sessionService.verifyTokenIsExpired())
                                $rootScope.logout();
                        }],
                        permission: ['PermissionService', '$window', function (PermissionService, $window) {
                            if (!PermissionService.canPost('highlighted_press')) {
                                $window.location.href = '#/featured';
                            }
                        }]
                    }
                })
                .when('/featured/edit/:id', {
                    templateUrl: 'modules/pressOffice/featured/featured.form.template.html',
                    controller: 'featuredEditController',
                    controllerAs: 'vm',
                    resolve: {
                        isLogged: ['sessionService', function (sessionService) {
                            return sessionService.getIsLogged();
                        }],
                        tokenIsExpired: ['sessionService', '$rootScope', function (sessionService, $rootScope) {
                            if (sessionService.verifyTokenIsExpired())
                                $rootScope.logout();
                        }],
                        permission: ['PermissionService', '$window', '$routeParams', function (PermissionService, $window, $routeParams) {
                            if (!PermissionService.canPut('highlighted_press', $routeParams.id)) {
                                $window.location.href = '#/featured';
                            }
                        }]
                    }
                });
        });
})();
