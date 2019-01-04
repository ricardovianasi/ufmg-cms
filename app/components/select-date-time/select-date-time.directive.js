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
                isRequired: '='
            }
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            ctrl.errorInvalidDate = false;
            ctrl.errorInvalidHour = false;
            ctrl.blur = blur;
            ctrl.changeTime = changeTime;
            ctrl.changeDate = changeDate;

            function blur() {
                _isDateValid();
                ctrl.onBlur();
            }

            function changeTime() {
                _isTimeValid();
                ctrl.onChangeTime();
            }

            function changeDate() {
                ctrl.onChangeDate();
            }

            function _isTimeValid() {
                let time = _getTime();
                let patternTime = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/;
                let isValidHour = patternTime.test(time);
                if (!isValidHour && !!time) {
                    ctrl.errorInvalidHour = true;
                    _setValidity(ctrl.idTime, 'validTime', false);
                }else {
                    ctrl.errorInvalidHour = false;
                    _setValidity(ctrl.idTime, 'validTime', true);
                }
            }

            function _isDateValid() {
                if (!_getDate()) {
                    ctrl.errorInvalidDate = true;
                    _setValidity(ctrl.idDate, 'validDate', false);
                } else {
                    ctrl.errorInvalidDate = false;
                    _setValidity(ctrl.idDate, 'validDate', true);
                }
            }

            function _getTime() {
                return ctrl.model[ctrl.namePropTime];
            }

            function _getDate() {
                return ctrl.model[ctrl.namePropDate];
            }

            function _getForm() {
                if(scope.$parent[ctrl.idForm]) {
                    return scope.$parent[ctrl.idForm];
                } else {
                    return scope.$parent.$parent[ctrl.idForm];
                }
            }

            function _setValidity(idController, key, isValid) {
                let form = _getForm();
                if(isValid) {
                    delete form.$error[key];
                    delete form[idController].$error[key];
                } else {
                    form[idController].$setValidity(key, isValid);
                }
            }
        }
    }
    /* @ngInject */
    function SelectDateTimeDirectiveController () {

    }
})();
