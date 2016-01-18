;(function () {
  'use strict';

  angular.module('componentsModule')
    .directive('publishmentOptions', [
      '$timeout',
      'StatusService',
      '$location',
      function ($timeout, StatusService, $location) {

        return {
          restrict: 'E',
          templateUrl: 'components/publishment/publishment.template.html',
          scope: {
            obj: '=routeModel'
          },
          link: function ($scope, element, attrs) {
            console.log('... PublishmentDirective');

            var obj = attrs.routeModel;
            console.log($scope.$parent[obj]);
            $scope.obj = $scope.$parent[obj];
            $scope.obj.highlight_ufmg = $scope.obj.highlight_ufmg;
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

            $scope.status = function(status) {
              if($scope.obj.status == status)
                $scope.obj.status = '';
              else
                $scope.obj.status = status;
            };

            $scope.checkHighlightedUfmg = function(){
              if($scope.obj.highlight_ufmg == 1)
                $scope.obj.highlight_ufmg = 0;
              else
                $scope.obj.highlight_ufmg = 1;

              console.log($scope.obj.highlight_ufmg);
            };

            $scope.back = function(){
              $location.path('news');
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
