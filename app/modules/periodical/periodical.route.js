(function () {
    'use strict';

    angular.module('periodicalModule')
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/periodicals', {
                    templateUrl: 'modules/periodical/periodical.template.html',
                    controller: 'PeriodicalController'
                })
                .when('/periodicals/new', {
                    templateUrl: 'modules/periodical/periodical.form.template.html',
                    controller: 'PeriodicalNewController',
                    resolve: {
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
                    resolve: {
                        permission: ['PermissionService', '$window', '$routeParams', function (PermissionService, $window, $routeParams) {
                            if (!PermissionService.canPut('periodicals', $routeParams.id)) {
                                $window.location.href = '#/periodicals';
                            }
                        }]
                    }
                })
                .when('/periodicals/:id/editions', {
                    templateUrl: 'modules/periodical/editions/periodical-editions.template.html',
                    controller: 'PeriodicalEditionsController'
                })
                .when('/periodicals/:id/editions/edit/:edition', {
                    templateUrl: 'modules/periodical/editions/periodical-editions.edition.form.template.html',
                    controller: 'PeriodicalEditionEditController',
                    resolve: {
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
                    resolve: {
                        permission: ['PermissionService', '$window', '$routeParams', function (PermissionService, $window, $routeParams) {
                            if (!PermissionService.canPost('editions', $routeParams.id)) {
                                $window.location.href = '#/periodicals/' + $routeParams.id + '/editions';
                            }
                        }]
                    }
                });
        }]);
})();
