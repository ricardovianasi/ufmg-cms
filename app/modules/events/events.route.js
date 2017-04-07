(function () {
    'use strict';

    angular.module('eventsModule')
        /**ngInject */
        .config(function ($routeProvider) {
            $routeProvider
                .when('/events', {
                    templateUrl: 'modules/events/events.template.html',
                    controller: 'EventsController as vm',
                    controllerAs: 'ctrl'
                })
                .when('/events/new', {
                    templateUrl: 'modules/events/events.form.template.html',
                    controller: 'EventsNewController as vm',
                    controllerAs: 'ctrl',
                    resolve: {
                        permission: ['PermissionService', '$window', function (PermissionService, $window) {
                            if (!PermissionService.canPut('events')) {
                                $window.location.href = '#/events';
                            }
                        }]
                    }
                })
                .when('/events/edit/:id', {
                    templateUrl: 'modules/events/events.form.template.html',
                    controller: 'EventsEditController as vm',
                    controllerAs: 'ctrl',
                    resolve: {
                        permission: ['PermissionService', '$window', '$routeParams', function (PermissionService, $window, $routeParams) {
                            if (!PermissionService.canPut('events', $routeParams.id)) {
                                $window.location.href = '#/events';
                            }
                        }]
                    }
                });
        });
})();
