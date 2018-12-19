(function() {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('alertPortalModule')
        .component('alertPublishment', {
            templateUrl: 'modules/alert/alert-publishment/alert.publishment.html',
            controller: AlertPublishmentCtrl,
            controllerAs: '$ctrl',
            bindings: {
                target: '=',
            },
        });

    /** ngInject */
    function AlertPublishmentCtrl() {
        var $ctrl = this;


        ////////////////

        $ctrl.$onInit = function() { };
        $ctrl.$onChanges = function(changesObj) { };
        $ctrl.$onDestroy = function() { };
    }
})();
