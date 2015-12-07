;(function(){
'use strict';
angular
  .module('componentsModule')
  .directive('publishmentOptions', [
    'StatusService', function (StatusService) {

      return {
        restrict: 'E',
        templateUrl: '/views/publishment.template.html',
        scope: {
          obj: '=routeModel'
        },
        link: function ($scope, element, attrs) {
          console.log('... PublishmentDirective');

          var obj = attrs.routeModel;

          $scope.obj = $scope.$parent[obj];
          $scope.publish = $scope.$parent.publish;
          $scope.remove = $scope.$parent.remove;
          $scope.statuses = {};

          // Statuses
          StatusService.getStatus().then(function (data) {
            $scope.statuses = data.data;
          });
        }
      };
    }
  ]);
})();
