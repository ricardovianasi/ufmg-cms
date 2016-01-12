;(function () {
  'use strict';

 angular
  .module('componentsModule')
  .directive('audio', function($sce) {
    return {
      restrict: 'A',
      scope: { audioUrl:'=' },
      replace: true,
      template: '<audio ng-src="{{url}}" controls></audio>',
      link: function (scope) {
          scope.$watch('audioUrl', function (newVal, oldVal) {
             if (newVal !== undefined) {
                 scope.url = $sce.trustAsResourceUrl(newVal);
             }
          });
      }
    };
  });

})();
