(function() {
    'use strict';

    angular
        .module('alertPortalModule')
        .directive('alertPublishment', alertPublishment);

    alertPublishment.$inject = ['DateTimeHelper', 'NotificationService'];
    function alertPublishment(DateTimeHelper, NotificationService) {
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
                permission: '=',
                methodPublish: '&',
                methodRemove: '&'
            }
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            _initDatePickerOptions();

            ctrl.publish = publish;
            ctrl.remove = remove;

            function publish(formPubAlert) {
                let formAlert = scope.$parent.formData;
                if(formPubAlert.$valid && formAlert.$valid) {
                    ctrl.methodPublish();
                } else {
                    NotificationService.error('Existem campos obrigatórios vazios ou inválidos.');
                }
            }

            function remove() {
                ctrl.methodRemove();
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
