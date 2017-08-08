(function () {
    'use strict';

    angular.module('eventsModule')
        /**ngInject */
        .config(function ($routeProvider) {
            $routeProvider
                .when('/events', {
                    templateUrl: 'modules/events/events.template.html',
                    controller: 'EventsController'
                })
                .when('/events/new', {
                    templateUrl: 'modules/events/events.form.template.html',
                    controller: 'EventsNewController',
                    resolve: {
                        permission: ['PermissionService', '$window',
                            function (PermissionService, $window) {
                                if (!PermissionService.canPut('events')) {
                                    $window.location.href = '#/events';
                                }
                            }
                        ]
                    }
                })
                .when('/events/edit/:id', {
                    templateUrl: 'modules/events/events.form.template.html',
                    controller: 'EventsEditController',
                    resolve: {
                        permission: ['PermissionService', '$window', '$routeParams',
                            function (PermissionService, $window, $routeParams) {
                                if (!PermissionService.canPut('events', $routeParams.id)) {
                                    $window.location.href = '#/events';
                                }
                            }
                        ]
                    }
                });
        });
})();
