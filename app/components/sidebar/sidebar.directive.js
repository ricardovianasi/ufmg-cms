(function () {
    'use strict';

    angular.module('componentsModule')
        /** ngInject */
        .directive('ufmgSidebar', function ($log) {
            return {
                restrict: 'A',
                templateUrl: 'components/sidebar/sidebar.template.html',
                controller: 'SidebarController',
                link: function () {
                    $log.info('SidebarController');
                }
            };
        });
})();
