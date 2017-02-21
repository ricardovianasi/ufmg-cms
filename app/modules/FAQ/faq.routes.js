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
                            VIEWER: function () {
                                return false;
                            },
                            isLogged: ['sessionService', function (sessionService) {
                                return sessionService.getIsLogged();
                            }],
                            tokenIsExpired: ['sessionService', '$rootScope', function (sessionService, $rootScope) {
                                if (sessionService.verifyTokenIsExpired())
                                    $rootScope.logout();
                            }]
                        }
                    })
                    .when('/faq/edit/:faqId', {
                        templateUrl: 'modules/FAQ/faq-new.template.html',
                        controller: 'faqNewController',
                        controllerAs: 'vm',
                        resolve: {
                            VIEWER: function () {
                                return false;
                            },
                            isLogged: ['sessionService', function (sessionService) {
                                return sessionService.getIsLogged();
                            }],
                            tokenIsExpired: ['sessionService', '$rootScope', function (sessionService, $rootScope) {
                                if (sessionService.verifyTokenIsExpired())
                                    $rootScope.logout();
                            }]
                        }
                    })
                    .when('/faq/view/:faqId', {
                        templateUrl: 'modules/FAQ/faq-new.template.html',
                        controller: 'faqNewController',
                        controllerAs: 'vm',
                        resolve: {
                            VIEWER: function () {
                                return true;
                            },
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
        ]);
})();
