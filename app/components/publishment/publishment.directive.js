;(function () {
  'use strict';

  angular.module('componentsModule')
    .directive('publishmentOptions', [
      '$timeout',
      'StatusService',
      function ($timeout, StatusService) {

        return {
          restrict: 'E',
          templateUrl: 'components/publishment/publishment.template.html',
          scope: {
            obj: '=routeModel'
          },
          link: function ($scope, element, attrs) {
            console.log('... PublishmentDirective');

            var obj = attrs.routeModel;

            $scope.obj = $scope.$parent[obj];
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

            // Statuses
            StatusService.getStatus().then(function (data) {
              $scope.statuses = data.data;
            });
          }
        };
      }
    ]);
})();
