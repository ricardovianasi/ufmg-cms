;(function () {
  'use strict';

  angular.module('componentsModule')
    .directive('publishmentOptions', PublishmentOptions);

  PublishmentOptions.$inject = [
    '$timeout',
    '$location',
    '$filter',
    'StatusService',
  ];

  function PublishmentOptions($timeout, $location, $filter, StatusService) {
    return {
      restrict: 'E',
      templateUrl: 'components/publishment/publishment.template.html',
      scope: {
        obj: '=routeModel'
      },
      link: function ($scope, element, attrs) {
        console.log('... PublishmentDirective');

        $scope.obj = $scope.$parent.$eval(attrs.routeModel);
        $scope.publish = $scope.$parent.publish;
        $scope.remove = $scope.$parent.remove;
        $scope.statuses = [];

        $scope.saveDraft = function ($event) {
          $event.stopPropagation();

          $scope.obj.status = StatusService.STATUS_DRAFT;

          $timeout(function () {
            angular.element('#publish-button').trigger('click');
          }, 100);
        };

        $scope.status = function (status) {
          if ($scope.obj.status == status)
            $scope.obj.status = '';
          else
            $scope.obj.status = status;
        };

        $scope.checkHighlightedUfmg = function () {
          $scope.obj.highlight_ufmg = !$scope.obj.highlight_ufmg;
        };

        $scope.back = function () {
          $location.path($filter('format')('/{0}', inflection.pluralize(attrs.routeModel)));
        };

        // Statuses
        StatusService.getStatus().then(function (data) {
          $scope.statuses = data.data;
        });
      }
    };
  }
})();
