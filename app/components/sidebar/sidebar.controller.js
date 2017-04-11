(function () {
    'use strict';

    angular
        .module('componentsModule')

        /** ngInject */
        .controller('SidebarController', function ($scope, NavigationService, $log, $window) {
            $log.info('SidebarController');
            var vm = $scope;

            vm.$on('$routeChangeSuccess', function () {
                getParams();
            });

            function onInit() {
                NavigationService.get()
                    .then(function (menu) {
                        vm.navigation = menu;
                    });
                getParams();
            }

            function getParams() {
                vm.itemActive = $window.location.hash.split('/')[1];
            }


            onInit();
        });
})();
