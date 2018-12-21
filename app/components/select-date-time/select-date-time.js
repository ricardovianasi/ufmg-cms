(function() {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('componentsModule')
        .component('selectDateTime', {
            templateUrl: 'components/select-date-time/select-date-time.html',
            controller: SelectDateTimeController,
            controllerAs: '$ctrl',
            bindings: {
                inputLabel: '@',
                idDate: '@',
                idTime: '@',
                namePropDate: '@',
                namePropTime: '@',
                model: '=',
                onBlur: '&',
                onChangeTime: '&',
                onChangeDate: '&',
                isDisable: '=',
                hasError: '=',
            },
        });

    /** ngInject */
    function SelectDateTimeController(DateTimeHelper, $scope) {
        var $ctrl = this;
        $ctrl.datepickerOpt = { };
        $ctrl.timepickerOpt = { };

        $ctrl.blur = blur;
        $ctrl.changeTime = changeTime;
        $ctrl.changeDate = changeDate;
        ////////////////

        $ctrl.$onInit = function() { _initDateTimePickerOptions(); };
        $ctrl.$onChanges = function(changesObj) {
            console.log('onChanges', changesObj);
        };
        $ctrl.$onDestroy = function() { };

        function blur() {
            $ctrl.onBlur();
        }

        function changeTime() {
            $ctrl.onChangeTime();
        }

        function changeDate() {
            $ctrl.onChangeDate();
            console.log(parentCtrl);
        }

        function _initDateTimePickerOptions() {
            $ctrl.datepickerOpt[$ctrl.idDate] = DateTimeHelper.getDatepickerOpt();
            $ctrl.datepickerOpt[$ctrl.idTime] = DateTimeHelper.getDatepickerOpt();
        }
    }
})();
