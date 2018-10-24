(function() {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('componentsModule')
        .component('menuResponsiveComponent', {
            templateUrl: 'components/menu-responsive/menu-responsive.template.html',
            controller: MenuResponsiveController,
            controllerAs: '$ctrl',
            bindings: { },
        });

    /** ngInject */
    function MenuResponsiveController(NavigationService, $rootScope, $location) {
        var $ctrl = this;

        $ctrl.clickMenu = clickMenu;
        ////////////////

        function clickMenu(menu) {
            if (menu.location) {
                $location.path(menu.location);
                $rootScope.toggleResponsiveMenu();
            }
        }

        function loadMenu() {
            NavigationService.get().then(items => {
                let itemsMenus = items.filter(item => {
                    let enabled = item.enabled;
                    if(item.menuItems) {
                        const subMenuEnabled = item.menuItems.filter(subMenu => subMenu.enabled);
                        enabled = subMenuEnabled.length > 0;
                    }
                    return enabled;
                });
                $ctrl.itemsMenu = itemsMenus;
            });
        }

        $ctrl.$onInit = function() { loadMenu(); };
        $ctrl.$onChanges = function(changesObj) { };
        $ctrl.$onDestroy = function() { };
    }
})();
