(function () {
    'use strict';

    angular
        .module('componentsModule')

        /** ngInject */
        .controller('SidebarController', function ($scope, NavigationService, $log, $window) {
            $log.info('SidebarController');
            var vm = $scope;
            NavigationService.get()
                .then(function (menu) {
                    vm.navigation = menu;
                });

            vm.$on('$routeChangeSuccess', function () {
                getParams();
            });

            function getParams() {
                vm.itemActive = $window.location.hash.split('/')[1];
            }

            function onInit() {
                getParams();
            }

            onInit();
        });
})();
