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
                    controller: 'EventsNewController'
                })
                .when('/events/edit/:id', {
                    templateUrl: 'modules/events/events.form.template.html',
                    controller: 'EventsEditController'
                })
                .when('/events/view/:id', {
                    templateUrl: 'modules/events/events.form.template.html',
                    controller: 'EventsEditController'
                });
        });
})();
