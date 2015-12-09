;(function () {
  'use strict';

  angular
    .module('clippingsModule')
    .controller('ClippingsNewController', ClippingsNewController);

  ClippingsNewController.$inject = [
    '$scope',
    '$uibModal',
    '$timeout',
    '$location',
    '$filter',
    'ClippingsService',
    'MediaService',
    'NotificationService',
    'StatusService',
    'DateTimeHelper'
  ];

  function ClippingsNewController($scope,
                                  $modal,
                                  $timeout,
                                  $location,
                                  $filter,
                                  ClippingsService,
                                  MediaService,
                                  NotificationService,
                                  StatusService,
                                  DateTimeHelper) {

    console.log('... ClippingsNewController');

    $scope.title = 'Novo Clipping';
    $scope.breadcrumb = $scope.title;
    $scope.clipping = {
      title: '',
      date: {
        year: null,
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
    $scope.time_years = ['2015', '2016', '2017'];
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
