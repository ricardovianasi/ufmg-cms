(function () {
    'use strict';

    angular
        .module('calendarModule')
        /** ngInject */
        .config(function ($routeProvider) {
            $routeProvider
                .when('/calendar', {
                    templateUrl: 'modules/calendar/calendar.template.html',
                    controller: 'CalendarController',
                    controllerAs: 'ctrl'
                });
        });
})();
