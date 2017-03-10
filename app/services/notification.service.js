(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('NotificationService', NotificationService);

    /** ngInject */
    function NotificationService(toastr, $log) {
        $log.info('NotificationService');

        return {
            success: function (title, msg) {
                toastr.success(title, msg);
            },
            error: function (title, msg) {
                toastr.error(title, msg);
            },
            warning: function (title, msg) {
                toastr.warning(title, msg);
            },
            info: function (title, msg) {
                toastr.info(title, msg);
            }
        };
    }
})();
