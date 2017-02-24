(function () {
    'use strict';

    angular
        .module('componentsModule')

        /** ngInject */
        .controller('SidebarController', function ($scope, NavigationService, $log) {
            $log.info('SidebarController');
            NavigationService.get().then(function (menu) {
                $scope.navigation = menu;
            });
        });
})();
