(function() {
    'use strict';

    // Usage:
    // 
    // Creates:
    // 

    angular
        .module('componentsModule')
        .component('selectTime', {
            templateUrl: 'components/select-time/select-time.html',
            controller: SelectTimeController,
            controllerAs: '$ctrl',
            bindings: {
                isDisabled: '='
            },
        });

    /** ngInject */
    function SelectTimeController() {
        var $ctrl = this;
        

        ////////////////

        function _setSelectHour() {
            $ctrl.listHours = [...Array(24).keys()];
            $ctrl.listMinutes = [...Array(60).keys()];
        }

        $ctrl.$onInit = function() {
            _setSelectHour();
        };
        $ctrl.$onChanges = function(changesObj) { };
        $ctrl.$onDestroy = function() { };
    }
})();