(function() {
    'use strict';

    angular
        .module('alertPortalModule')
        .directive('alertPublishment', alertPublishment);

    alertPublishment.$inject = ['DateTimeHelper'];
    function alertPublishment(DateTimeHelper) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: AlertPublishmentController,
            controllerAs: 'vm',
            link: link,
            templateUrl: 'modules/alert/alert-publishment/alert.publishment.html',
            restrict: 'E',
            scope: {
                target: '=',
                methodPublish: '&'
            }
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            _initDatePickerOptions();

            ctrl.onChangeInitTime = onChangeInitTime;
            ctrl.onChangeInitDate = onChangeInitDate;
            ctrl.onChangeEndTime = onChangeEndTime;
            ctrl.onChangeEndDate = onChangeEndDate;

            function publish(formPubAlert) {
                console.log('publish', formPubAlert);
                ctrl.methodPublish();
            }

            function onChangeInitTime() {

            }

            function onChangeInitDate() {

            }

            function onChangeEndTime() {

            }

            function onChangeEndDate() {

            }

            function _initDatePickerOptions() {
                ctrl.initdatepickerOpt = {
                    initDate: DateTimeHelper.getDatepickerOpt(),
                };
                ctrl.enddatepickerOpt = {
                    endDate: DateTimeHelper.getDatepickerOpt(),
                };
            }
        }
    }
    /* @ngInject */
    function AlertPublishmentController () {

    }
})();
