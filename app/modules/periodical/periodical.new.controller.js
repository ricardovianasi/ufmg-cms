;(function () {
  'use strict';

  angular.module('periodicalModule')
    .controller('PeriodicalNewController', PeriodicalNewController);

  PeriodicalNewController.$inject = [
    '$scope',
    '$location',
    '$filter',
    'PeriodicalService',
    'StatusService',
    'NotificationService',
    'MediaService',
  ];

  /**
   * @param $scope
   * @param $location
   * @param $filter
   * @param PeriodicalService
   * @param StatusService
   * @param NotificationService
   * @param MediaService
   *
   * @constructor
   */
  function PeriodicalNewController($scope,
                                   $location,
                                   $filter,
                                   PeriodicalService,
                                   StatusService,
                                   NotificationService,
                                   MediaService) {
    console.log('... PeriodicalNewController');

    $scope.status = [];
    $scope.periodical = {};
    $scope.highlight_ufmg_visible = false;

    StatusService.getStatus().then(function (data) {
      $scope.status = data.data;
    });

    $scope.$watch('add_photos', function () {
      if ($scope.add_photos) {
        MediaService.newFile($scope.add_photos).then(function (data) {
          $scope.periodical.url = data.url;
          $scope.periodical.logo = data.id;
        });
      }
    });

    var date = new Date();

    $scope.date_formats = [
      {
        label: $filter('format')('ano ({0})', date.getFullYear()),
        format: 'Y'
      },
      {
        label: $filter('format')('mês/ano ({0}/{1})', date.getMonth() + 1, date.getFullYear()),
        format: 'm/Y'
      },
      {
        label: $filter('format')(
          'dia/mês/ano ({0}/{1}/{2})',
          date.getDate(),
          date.getMonth() + 1,
          date.getFullYear()
        ),
        format: 'd/m/Y'
      }
    ];

    $scope.removeImage = function () {
      $scope.periodical.logo = '';
      $scope.periodical.url = '';
    };

    $scope.publish = function (data) {
      var _data = angular.copy(data);

      delete _data.url;

      PeriodicalService.newPeriodical(_data).then(function (data) {
        NotificationService.success('Publicação criada com sucesso.');
        $location.path('/periodicals');
      });
    };
  }
})();
