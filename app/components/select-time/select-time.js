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
                ngModel: '=',
                moment: '=',
                changeTime: '&',
                weekDay: '='
            },
        });

    /** ngInject */
    function SelectTimeController() {
        var $ctrl = this;

        $ctrl.selectTime = selectTime;
        

        ////////////////

        function selectTime(type) {
            console.log('selectTime', $ctrl.hour, $ctrl.minute, type);
            if(type === 'hour' && !$ctrl.minute) {
                $ctrl.minute = '00';
            }
            if(_isFullFilled()) {
                let timeStr = $ctrl.hour + ':' + $ctrl.minute;
                $ctrl.ngModel = timeStr;
                let momentTime = _createMoment();
                $ctrl.moment = momentTime;
                $ctrl.changeTime({ $moment: momentTime, $time: timeStr});
            }
        }

        function _isFullFilled() {
            return !(!$ctrl.hour || !$ctrl.minute);
        }

        function _createMoment() {
            return moment().set({hour: $ctrl.hour, minute: $ctrl.minute, second: '0', millisecond: '0', day: $ctrl.weekDay});
        }

        function _setSelectHour() {
            $ctrl.listHours = [...Array(24).keys()].map(function(n) {return pad2(n);});
            $ctrl.listMinutes = [...Array(60).keys()]
                .filter(function(n) { return n % 5 == 0; })
                .map(function(n) {return pad2(n);});
        }

        function _splitTime(time) {
            let split = time.split(':');
            $ctrl.hour = split[0];
            $ctrl.minute = split[1];
            $ctrl.moment = _createMoment();
        }

        function pad2(number) {
            return (number < 10 ? '0' : '') + number;
       }

        $ctrl.$onInit = function() {
            _setSelectHour();
        };
        $ctrl.$onChanges = function() {
            if ($ctrl.ngModel) {
                _splitTime($ctrl.ngModel);
            }
        };
        $ctrl.$onDestroy = function() { };
    }
})();