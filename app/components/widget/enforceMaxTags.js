
;(function() {
  'use strict';

  angular
    .module('app')
    .directive('enforceMaxTags', enforceMaxTags);

    function enforceMaxTags() {
      return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelController) {
          var maxTags = attrs.maxTags ? parseInt(attrs.maxTags, '10') : null;
          ngModelController.$validators.checkLength = function(value) {
            if (value && maxTags && value.length > maxTags) {
              value.splice(value.length - 1, 1);
            }
            return value;
          };
        }
      };
    }

})();
