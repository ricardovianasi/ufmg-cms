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
                isDisabled: '=',
                ngModel: '='
            },
        });

    /** ngInject */
    function SelectTimeController() {
        var $ctrl = this;

        $ctrl.selectTime = selectTime;
        

        ////////////////

        function selectTime() {
            console.log('selectTime', $ctrl.hour, $ctrl.minute);
            $ctrl.ngModel = $ctrl.hour + ':' + $ctrl.minute;
        }

        function _setSelectHour() {
            $ctrl.listHours = [...Array(24).keys()].map(function(n) {return pad2(n);});
            $ctrl.listMinutes = [...Array(60).keys()].map(function(n) {return pad2(n);});
        }

        function _splitTime(time) {
            let split = time.split(':');
            $ctrl.hour = split[0];
            $ctrl.minute = split[1];
        }

        function pad2(number) {
            return (number < 10 ? '0' : '') + number;
       }

        $ctrl.$onInit = function() {
            _setSelectHour();
        };
        $ctrl.$onChanges = function(changesObj) {
            if ($ctrl.ngModel) {
                _splitTime($ctrl.ngModel);
            }
        };
        $ctrl.$onDestroy = function() { };
    }
})();