(function () {
    'use strict';

    angular.module('periodicalModule')
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/periodicals', {
                    templateUrl: 'modules/periodical/periodical.template.html',
                    controller: 'PeriodicalController',
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
                .when('/periodicals/new', {
                    templateUrl: 'modules/periodical/periodical.form.template.html',
                    controller: 'PeriodicalNewController',
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
                            if (!PermissionService.canPost('periodicals')) {
                                $window.location.href = '#/periodicals';
                            }
                        }]
                    }
                })
                .when('/periodicals/edit/:id', {
                    templateUrl: 'modules/periodical/periodical.form.template.html',
                    controller: 'PeriodicalEditController',
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
                            if (!PermissionService.canPut('periodicals', $routeParams.id)) {
                                $window.location.href = '#/periodicals';
                            }
                        }]
                    }
                })
                .when('/periodicals/:id/editions', {
                    templateUrl: 'modules/periodical/editions/periodical-editions.template.html',
                    controller: 'PeriodicalEditionsController',
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
                .when('/periodicals/:id/editions/edit/:edition', {
                    templateUrl: 'modules/periodical/editions/periodical-editions.edition.form.template.html',
                    controller: 'PeriodicalEditionEditController',
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
                            if (!PermissionService.canPut('editions', $routeParams.id)) {
                                $window.location.href = '#/periodicals/' + $routeParams.id + '/editions';
                            }
                        }]
                    }
                })
                .when('/periodicals/:id/editions/new', {
                    templateUrl: 'modules/periodical/editions/periodical-editions.edition.form.template.html',
                    controller: 'PeriodicalEditionNewController',
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
                            if (!PermissionService.canPost('editions', $routeParams.id)) {
                                $window.location.href = '#/periodicals/' + $routeParams.id + '/editions';
                            }
                        }]
                    }
                });
        }]);
})();
