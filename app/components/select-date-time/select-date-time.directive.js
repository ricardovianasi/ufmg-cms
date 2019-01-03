(function() {
    'use strict';

    angular
        .module('componentsModule')
        .directive('selectDateTimeDirective', selectDateTimeDirective);

    selectDateTimeDirective.$inject = [];
    function selectDateTimeDirective() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: SelectDateTimeDirectiveController,
            controllerAs: '$ctrl',
            link: link,
            templateUrl: 'components/select-date-time/select-date-time.html',
            restrict: 'E',
            scope: {
                inputLabel: '@',
                idForm: '@',
                idDate: '@',
                idTime: '@',
                namePropDate: '@',
                namePropTime: '@',
                model: '=',
                datepickerOpt: '=',
                onBlur: '&',
                onChangeTime: '&',
                onChangeDate: '&',
                isDisable: '=',
            }
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }
    /* @ngInject */
    function SelectDateTimeDirectiveController () {

        var $ctrl = this;

        $ctrl.errorInvalidDate = false;
        $ctrl.errorInvalidHour = false;
        $ctrl.blur = blur;
        $ctrl.changeTime = changeTime;
        $ctrl.changeDate = changeDate;

        function blur() {
            _isDateValid();
            $ctrl.onBlur();
        }

        function changeTime() {
            _isTimeValid();
            $ctrl.onChangeTime();
        }

        function changeDate() {
            $ctrl.onChangeDate();
        }

        function _isTimeValid() {
            let time = _getTime();
            let patternTime = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/;
            let isValidHour = patternTime.test(time);
            if (!isValidHour && !!time) {
                $ctrl.errorInvalidHour = true;
            }else {
                $ctrl.errorInvalidHour = false;
            }
            console.log('_isTimeValid', $ctrl.errorInvalidHour, time);
        }

        function _isDateValid() {
            if (!_getDate()) {
                $ctrl.errorInvalidDate = true;
            } else {
                $ctrl.errorInvalidDate = false;
            }
            console.log('_isDateValid', $ctrl.errorInvalidDate);
        }

        function _getTime() {
            return $ctrl.model[$ctrl.namePropTime];
        }

        function _getDate() {
            return $ctrl.model[$ctrl.namePropDate];
        }
    }
})();
