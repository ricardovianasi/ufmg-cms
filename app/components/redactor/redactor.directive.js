;(function () {
  'use strict';

  angular
    .module('componentsModule')
    .directive('redactor', redactor);

    function redactor() {
      return {
          require: '?ngModel',
          link: function($scope, elem, attrs, controller) {
            controller.$render = function() {
              console.log('...render');
              console.log($scope[attrs.redactor]);
              elem.redactor($scope[attrs.redactor]);
            };
          }
        };
      }
})();
