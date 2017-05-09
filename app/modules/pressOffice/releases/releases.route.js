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
                    controllerAs: 'ctrl'
                })
                .when('/releases/new', {
                    templateUrl: 'modules/pressOffice/releases/releases.form.template.html',
                    controller: 'ReleasesNewController',
                    controllerAs: 'ctrl',
                    resolve: {
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
                        permission: ['PermissionService', '$window', '$routeParams',
                            function (PermissionService, $window, $routeParams) {
                                if (!PermissionService.canPut('release', $routeParams.id)) {
                                    $window.location.href = '#/releases';
                                }
                            }
                        ]
                    }
                });
        });
})();
