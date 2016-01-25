;(function () {
  'use strict';

  angular.module('clippingsModule')
    .controller('ClippingsNewController', ClippingsNewController);

  ClippingsNewController.$inject = [
    '$scope',
    '$location',
    'ClippingsService',
    'NotificationService',
    'StatusService',
    'DateTimeHelper'
  ];

  function ClippingsNewController($scope,
                                  $location,
                                  ClippingsService,
                                  NotificationService,
                                  StatusService,
                                  DateTimeHelper) {
    console.log('... ClippingsNewController');

    $scope.title = 'Nova Matéria';
    $scope.breadcrumb = $scope.title;
    $scope.clipping = {
      title: '',
      date: {
        year: (new Date()).getFullYear(),
        month: null,
        day: null
      },
      status: StatusService.STATUS_PUBLISHED,
      origin: '',
      url: ''
    };

    // Time and Date
    $scope.time_days = DateTimeHelper.getDays();
    $scope.time_months = DateTimeHelper.getMonths();
    $scope.time_years = DateTimeHelper.yearRange(5); // 5 year back and forth
    $scope.time_hours = DateTimeHelper.getHours();
    $scope.time_minutes = DateTimeHelper.getMinutes();

    /**
     * Post to Event Endpoint
     *
     * @param data
     */
    $scope.publish = function (data) {
      ClippingsService.store(data).then(function () {
        NotificationService.success('Clipping criado com sucesso.');
        $location.path('/clippings');
      });
    };
  }
})();
