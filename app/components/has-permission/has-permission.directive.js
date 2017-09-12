(function () {
  'use strict';

  angular
      .module('componentsModule')
      .directive('hasPermission', hasPermissionCtrl);

  /** ngInject */
  function hasPermissionCtrl(PermissionService) {
      return {
          restrict: 'A',
          scope: {
              context: '@'
          },
          link: function ($scope, elem) {
              var hasPermission = PermissionService.hasPermission($scope.context);
              if (!hasPermission) {
                  elem.remove();
              }
          }
      };
  }
})();
