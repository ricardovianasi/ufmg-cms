(function () {
    'use strict';

    angular
        .module('componentsModule')

        /** ngInject */
        .controller('SidebarController', function (
            $scope,
            NavigationService,
            $log,
            $window
        ) {
            $log.info('SidebarController');
            var vm = $scope;

            vm.$on('$routeChangeSuccess', function () {
                getParams();
            });

            vm.calcNumberEnables = function (menuItems) {
                if (!menuItems) {
                    return [];
                }
                return menuItems.filter(function (a) {
                    return a.enabled === true;
                });
            };

            function onInit() {
                NavigationService.get()
                    .then(function (menu) {
                        vm.navigation = menu;
                        getParams();
                        loop: for (var index = 0; index < vm.navigation.length; index++) {
                            var itemMenu = vm.navigation[index];
                            if (angular.isUndefined(itemMenu.menuItems)) {
                                continue;
                            } else if (itemMenu.menuItems.length) {
                                for (var i = 0; i < itemMenu.menuItems.length; i++) {
                                    var subMenu = itemMenu.menuItems[i];
                                    if (vm.itemActive === subMenu.location) {
                                        itemMenu.isOpen = true;
                                        itemMenu.isActive = true;
                                    }
                                }
                            }
                        }
                    });
            }

            function getParams() {
                var location = $window.location.hash.split('/')[1];
                if (location === 'news') {
                    location = 'news/' + $window.location.hash.split('/')[2];
                }
                vm.itemActive = location;
            }
            onInit();
        });
})();
