;(function () {
  'use strict';

  angular.module('periodicalModule')
    .controller('PeriodicalEditController', PeriodicalEditController);

  PeriodicalEditController.$inject = [
    '$scope',
    '$routeParams',
    '$location',
    'PeriodicalService',
    'StatusService',
    'NotificationService',
    'MediaService',
    'DateTimeHelper',
  ];

  /**
   * @param $scope
   * @param $routeParams
   * @param PeriodicalService
   * @param StatusService
   * @param NotificationService
   * @param MediaService
   * @param DateTimeHelper
   * @param $location
   *
   * @constructor
   */
  function PeriodicalEditController($scope,
                                    $routeParams,
                                    $location,
                                    PeriodicalService,
                                    StatusService,
                                    NotificationService,
                                    MediaService,
                                    DateTimeHelper) {
    console.log('... PeriodicalEditController');

    $scope.status = [];

    StatusService.getStatus().then(function (data) {
      $scope.status = data.data;
    });

    $scope.periodical = {};

    PeriodicalService.getPeriodicals($routeParams.id).then(function (data) {
      $scope.periodical.id = data.data.id;
      $scope.periodical.name = data.data.name;
      $scope.periodical.logo = data.data.logo ? data.data.logo.id : '';
      $scope.periodical.url = data.data.logo ? data.data.logo.url : '';
      $scope.periodical.identifier = data.data.identifier;
      $scope.periodical.date = DateTimeHelper.dateToStr(data.data.date);
      $scope.periodical.date_format = data.data.date_format;
      $scope.periodical.status = data.data.status;

      var scheduled_at = DateTimeHelper.toBrStandard(data.data.scheduled_at, true, true);

      if (scheduled_at) {
        $scope.periodical.scheduled_date = scheduled_at.date;
        $scope.periodical.scheduled_time = scheduled_at.time;
      }

      $scope.$watch('add_photos', function () {
        if ($scope.add_photos) {
          MediaService.newFile($scope.add_photos).then(function (data) {
            $scope.periodical.url = data.url;
            $scope.periodical.logo = data.id;
          });
        }
      });
    });

    $scope.date_formats = [
      {id: 'Y'},
      {id: 'm/Y'},
      {id: 'd/m/Y'}
    ];

    $scope.removeImage = function () {
      $scope.periodical.logo = '';
      $scope.periodical.url = '';
    };

    $scope.publish = function (data) {
      var _data = angular.copy(data);

      _data.scheduled_at = data.scheduled_date + ' ' + data.scheduled_time;

      delete _data.url;
      delete _data.scheduled_date;
      delete _data.scheduled_time;

      PeriodicalService.updatePeriodical($routeParams.id, _data).then(function (data) {
        NotificationService.success('Periódico atualizado com sucesso.');
        $location.path('/periodicals');
      });
    };
  }
})();
