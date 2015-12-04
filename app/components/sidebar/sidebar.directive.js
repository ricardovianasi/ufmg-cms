;(function () {
  'use strict';

  angular.module('SidebarDirectiveModule')
    .directive('ufmgSidebar', [
      function () {
        return {
          restrict: 'E',
          templateUrl: 'components/sidebar/sidebar.template.html',
          controller: 'SidebarController',
          link: function () {
            console.log('... SidebarDirective');
          }
        };
      }
    ]);
})();
