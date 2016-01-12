;(function () {
  'use strict';

  angular.module('eventsModule')
    .config([
      '$routeProvider',
      function ($routeProvider) {
        $routeProvider
          .when('/events', {
            templateUrl: 'modules/events/events.template.html',
            controller: 'EventsController',
            controllerAs: 'ctrl'
          })
          .when('/events/new', {
            templateUrl: 'modules/events/events.form.template.html',
            controller: 'EventsNewController',
            controllerAs: 'ctrl'
          })
          .when('/events/edit/:id', {
            templateUrl: 'modules/events/events.form.template.html',
            controller: 'EventsEditController',
            controllerAs: 'ctrl'
          });
      }
    ]);
})();
