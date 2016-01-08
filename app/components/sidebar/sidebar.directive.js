;(function () {
  'use strict';

  angular.module('componentsModule')
    .directive('ufmgSidebar', [
      function () {
        return {
          restrict: 'A',
          templateUrl: 'components/sidebar/sidebar.template.html',
          controller: 'SidebarController',
          link: function () {
            clog('... SidebarDirective');
          }
        };
      }
    ]);
})();
