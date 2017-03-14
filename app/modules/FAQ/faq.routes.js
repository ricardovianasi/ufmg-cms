(function () {
    'use strict';

    angular.module('faqModule')
        .config([
            '$routeProvider',
            function ($routeProvider) {
                $routeProvider
                    .when('/faq', {
                        templateUrl: 'modules/FAQ/faq.template.html',
                        controller: 'faqController',
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
                    .when('/faq/new', {
                        templateUrl: 'modules/FAQ/faq-new.template.html',
                        controller: 'faqNewController',
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
                                if (!PermissionService.canPost('faq')) {
                                    $window.location.href = '#/faq';
                                }
                                return true;
                            }]
                        }
                    })
                    .when('/faq/edit/:faqId', {
                        templateUrl: 'modules/FAQ/faq-new.template.html',
                        controller: 'faqNewController',
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
                                if (!PermissionService.canPut('faq', $routeParams.faqId)) {
                                    $window.location.href = '#/faq';
                                }
                                return true;
                            }]
                        }
                    })
                    .when('/faq/view/:faqId', {
                        templateUrl: 'modules/FAQ/faq-new.template.html',
                        controller: 'faqNewController',
                        controllerAs: 'vm',
                        resolve: {
                            isLogged: ['sessionService', function (sessionService) {
                                return sessionService.getIsLogged();
                            }],
                            tokenIsExpired: ['sessionService', '$rootScope', function (sessionService, $rootScope) {
                                if (sessionService.verifyTokenIsExpired())
                                    $rootScope.logout();
                            }],
                            permission: function () {
                                return false;
                            }
                        }
                    });
            }
        ]);
})();
