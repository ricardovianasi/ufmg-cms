;(function () {
  'use strict';

  angular
    .module('componentsModule')
    .controller('SidebarController', [
      '$scope',
      'NavigationService',
      function ($scope, NavigationService) {
        clog('... SidebarController');

        $scope.navigation = NavigationService.get();
      }
    ]);
})();
