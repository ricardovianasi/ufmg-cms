;(function () {
  'use strict';

  angular.module('eventsModule')
    .config([
      '$routeProvider',
      function ($routeProvider) {
        $routeProvider
          .when('/events', {
            templateUrl: 'modules/events/events.template.html',
            controller: 'EventsController as vm',
            controllerAs: 'ctrl'
          })
          .when('/events/new', {
            templateUrl: 'modules/events/events.form.template.html',
            controller: 'EventsNewController as vm',
            controllerAs: 'ctrl'
          })
          .when('/events/edit/:id', {
            templateUrl: 'modules/events/events.form.template.html',
            controller: 'EventsEditController as vm',
            controllerAs: 'ctrl'
          });
      }
    ]);
})();
