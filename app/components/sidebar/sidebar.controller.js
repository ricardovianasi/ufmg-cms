(function () {
    'use strict';

    angular
        .module('componentsModule')

        /** ngInject */
        .controller('SidebarController', function ($scope, NavigationService, $log) {
            $log.info('SidebarController');
            $scope.navigation = NavigationService.get();
        });
})();
