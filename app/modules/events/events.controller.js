;(function () {
  'use strict';

  angular.module('eventsModule')
    .controller('EventsController', EventsController);

  EventsController.$inject = [
    '$scope',
    'EventsService',
    'DateTimeHelper'
  ];

  function EventsController($scope, EventsService, DateTimeHelper) {
    console.log('... EventsController');

    $scope.title = 'Eventos';
    $scope.events = [];
    $scope.currentPage = 1;

    var loadEvents = function (page) {
      EventsService.getEvents(page).then(function (data) {
        $scope.events = data.data;
      });
    };

    loadEvents();

    $scope.changePage = function () {
      loadEvents($scope.currentPage);
    };

    $scope.convertDate = function (date) {
      return DateTimeHelper.dateToStr(date);
    };
  }
})();
