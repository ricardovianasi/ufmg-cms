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
                        controllerAs: 'vm'
                    })
                    .when('/faq/new', {
                        templateUrl: 'modules/FAQ/faq.new.template.html',
                        controller: 'faqNewController',
                        controllerAs: 'vm',
                        resolve: {
                            permission: ['NotificationService','PermissionService', '$window',
                                function (NotificationService, PermissionService, $window) {
                                    if (!PermissionService.canPost('faq')) {
                                        $window.location.href = '#/faq';
                                        NotificationService.warn('Você não possui acesso a está página.', 'ATENÇÃO');
                                    }
                                    return true;
                                }
                            ]
                        }
                    })
                    .when('/faq/edit/:faqId', {
                        templateUrl: 'modules/FAQ/faq.new.template.html',
                        controller: 'faqNewController',
                        controllerAs: 'vm',
                        resolve: {
                            permission: ['NotificationService','PermissionService', '$window', '$routeParams',
                                function (NotificationService, PermissionService, $window, $routeParams) {
                                    if (!PermissionService.canPut('faq', $routeParams.faqId)) {
                                        $window.location.href = '#/faq';
                                        NotificationService.warn('Você não possui acesso a está página.', 'ATENÇÃO');
                                    }
                                    return true;
                                }
                            ]
                        }
                    })
                    .when('/faq/view/:faqId', {
                        templateUrl: 'modules/FAQ/faq.new.template.html',
                        controller: 'faqNewController',
                        controllerAs: 'vm',
                        resolve: {
                            permission: function () {
                                return false;
                            }
                        }
                    });
            }
        ]);
})();
