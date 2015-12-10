;(function () {
  'use strict';

  angular.module('componentsModule')
    .directive('ufmgSidebar', [
      function () {
        return {
          restrict: 'E',
          templateUrl: '/components/sidebar/sidebar.template.html',
          controller: 'SidebarController',
          link: function () {
            console.log('... SidebarDirective');
          }
        };
      }
    ]);
})();
