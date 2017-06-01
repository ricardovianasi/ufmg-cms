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
                    controllerAs: 'ctrl'
                })
                .when('/clippings/new', {
                    templateUrl: 'modules/pressOffice/clippings/clippings.form.template.html',
                    controller: 'ClippingsNewController',
                    controllerAs: 'ctrl',
                    resolve: {
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
                        permission: ['PermissionService', '$window', '$routeParams',
                            function (PermissionService, $window, $routeParams) {
                                if (!PermissionService.canPut('clipping', $routeParams.id)) {
                                    $window.location.href = '#/clippings';
                                }
                            }
                        ]
                    }
                });
        });
})();
