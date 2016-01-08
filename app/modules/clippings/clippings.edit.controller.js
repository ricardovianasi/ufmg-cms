;(function () {
  'use strict';

  angular
    .module('clippingsModule')
    .controller('ClippingsEditController', ClippingsEditController);

  ClippingsEditController.$inject = [
    '$scope',
    '$uibModal',
    '$timeout',
    '$location',
    '$routeParams',
    '$filter',
    'ClippingsService',
    'MediaService',
    'NotificationService',
    'StatusService',
    'DateTimeHelper'
  ];

  function ClippingsEditController($scope,
                                   $modal,
                                   $timeout,
                                   $location,
                                   $routeParams,
                                   $filter,
                                   ClippingsService,
                                   MediaService,
                                   NotificationService,
                                   StatusService,
                                   DateTimeHelper) {
    clog('... ClippingsEditController');

    $scope.title = 'Editar Clipping: ';
    $scope.breadcrumb = $scope.title;
    $scope.clipping = {};

    // Time and Date
    $scope.time_days = DateTimeHelper.getDays();
    $scope.time_months = DateTimeHelper.getMonths();
    $scope.time_years = ['2015', '2016', '2017'];
    $scope.time_hours = DateTimeHelper.getHours();
    $scope.time_minutes = DateTimeHelper.getMinutes();

    ClippingsService.getClipping($routeParams.id).then(function (data) {
      var clipping = data.data;
      clipping.date = {
        year: $filter('date')(data.data.date, 'yyyy'),
        month: $filter('date')(data.data.date, 'MM'),
        day: $filter('date')(data.data.date, 'dd')
      };

      $scope.clipping = clipping;
      $scope.title += clipping.title;
    });

    /**
     * Post to Event Endpoint
     *
     * @param data
     */
    $scope.publish = function (data) {
      ClippingsService.update(data, $routeParams.id).then(function () {
        NotificationService.success('Clipping salvo com sucesso.');
        $location.path('/clippings');
      });
    };
  }
})();
