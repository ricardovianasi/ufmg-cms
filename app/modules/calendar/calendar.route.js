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
                    controllerAs: 'ctrl',
                    resolve: {
                        isLogged: ['sessionService', function (sessionService) {
                            return sessionService.getIsLogged();
                        }],
                        tokenIsExpired: ['sessionService', '$rootScope', function (sessionService, $rootScope) {
                            if (sessionService.verifyTokenIsExpired())
                                $rootScope.logout();
                        }]
                    }
                });
        });
})();
