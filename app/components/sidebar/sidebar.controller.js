;(function () {
  'use strict';

  angular.module('SidebarDirectiveModule', [
      'NavigationServiceModule'
    ])
    .controller('SidebarController', [
      '$scope',
      'NavigationService',
      function ($scope, NavigationService) {
        console.log('... SidebarController');

        $scope.navigation = NavigationService.get();
      }
    ]);
})();
