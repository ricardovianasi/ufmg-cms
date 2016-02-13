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
        $scope.highlight_ufmg_visible = $scope.$parent.highlight_ufmg_visible;

        $scope.saveDraft = function ($event) {
          $event.stopPropagation();

          $scope.obj.status = StatusService.STATUS_DRAFT;
          $scope.obj.saveDraftClicked = true;
          $scope.publish($scope.obj);
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
          var back = $filter('format')('/{0}', inflection.pluralize(attrs.routeModel));

          if (typeof attrs.back !== 'undefined') {
            back = attrs.back;
          }

          $location.path(back);
        };

        // Statuses
        StatusService.getStatus().then(function (data) {
          $scope.statuses = data.data;
        });
      }
    };
  }
})();
