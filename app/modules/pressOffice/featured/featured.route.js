(function () {
    'use strict';

    angular
        .module('featuredModule')
        /** ngInject */
        .config(function ($routeProvider) {

            $routeProvider
                .when('/featured', {
                    templateUrl: 'modules/pressOffice/featured/featured.template.html',
                    controller: 'FeaturedController'
                })
                .when('/featured/new', {
                    templateUrl: 'modules/pressOffice/featured/featured.form.template.html',
                    controller: 'featuredNewController',
                    resolve: {
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
                    resolve: {
                        permission: ['PermissionService', '$window', '$routeParams', function (PermissionService, $window, $routeParams) {
                            if (!PermissionService.canPut('highlighted_press', $routeParams.id)) {
                                $window.location.href = '#/featured';
                            }
                        }]
                    }
                });
        });
})();
