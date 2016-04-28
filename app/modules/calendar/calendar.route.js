;(function () {
  'use strict';

  angular
    .module('calendarModule')
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/calendar', {
          templateUrl: 'modules/calendar/calendar.template.html',
          controller: 'CalendarController',
          controllerAs: 'ctrl',
          resolve: {
            isLogged: ['sessionService', function(sessionService) {
              return sessionService.getIsLogged();
            }]
          }
        });
    }]);

})();
