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
    function MenuResponsiveController() {
        var $ctrl = this;


        ////////////////

        $ctrl.$onInit = function() { };
        $ctrl.$onChanges = function(changesObj) { };
        $ctrl.$onDestroy = function() { };
    }
})();
