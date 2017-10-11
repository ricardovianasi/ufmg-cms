(function () {
    'use strict';

    angular
        .module('componentsModule')
        .directive('maskDate', maskDateCtrl);

    /** ngInject */
    function maskDateCtrl(PermissionService) {
        return {
            restrict: 'A',
            link: function ($scope, elem, attr) {
                element.inputmask("99/99/9999");
            }
        };
    }
})();
